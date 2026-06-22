import { CF_TURNSTILE_SECRET_KEY } from "$env/static/private";

export async function validateTurnstile(
  token: FormDataEntryValue | null,
  remoteip: string | null,
) {
  if (typeof token !== "string" || token.length === 0) {
    return { success: false, "error-codes": ["missing-input-response"] };
  }

  const formData = new FormData();

  formData.append("secret", CF_TURNSTILE_SECRET_KEY);
  formData.append("response", token);

  if (remoteip) {
    formData.append("remoteip", remoteip);
  }

  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(10_000),
      },
    );

    const result = await response.json();
    return result;
  } catch (err) {
    console.error("Turnstile validation error:", err);
    return { success: false, "error-codes": ["internal-error"] };
  }
}

export function getRequestIp(request: Request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    null
  );
}
