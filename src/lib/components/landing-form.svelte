<script lang="ts">
  import Icon from "@iconify/svelte";
  import { PUBLIC_CF_TURNSTILE_SITE_KEY } from "$env/static/public";
  import { SMS_CONSENT_TEXT } from "$lib/contact-info";

  let error = $state("");
  let success = $state(false);

  async function submitLanding(event: SubmitEvent) {
    event.preventDefault();

    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);

    const response = await fetch("/api/landing", {
      method: "POST",
      body: data,
    });

    const result = await response.json();

    if (!response.ok) {
      error = result.errors[0].message;
      return;
    }

    error = "";
    success = true;
  }
</script>

<form
  method="POST"
  onsubmit={submitLanding}
  class="card bg-base-200 w-full max-w-screen border border-neutral/10 shadow-sm"
>
  <div class="card-body text-base-content">
    <h2 class="card-title uppercase text-xl font-semibold tracking-wide ">
      We'll text you soon
    </h2>

    <fieldset class="fieldset">
      <label for="name" class="fieldset-label uppercase">Name</label>
      <input
        name="name"
        id="name"
        type="text"
        class="input w-full"
        placeholder="Your name"
        disabled={success}
      >
    </fieldset>

    <fieldset class="fieldset">
      <label for="phone" class="fieldset-label uppercase">Phone</label>
      <input
        name="phone"
        id="phone"
        type="tel"
        autocomplete="tel"
        class="input w-full"
        placeholder="Your phone number"
        disabled={success}
      >
    </fieldset>

    <fieldset class="fieldset my-2">
      <label
        for="consent"
        class="font-sans text-wrap text-xs font-light flex gap-2"
      >
        <input
          id="consent"
          name="consent"
          checked={false}
          type="checkbox"
          class="checkbox checkbox-primary"
          disabled={success}
        >
        <span>{SMS_CONSENT_TEXT}</span>
      </label>
    </fieldset>

    <div class="cf-turnstile" data-sitekey={PUBLIC_CF_TURNSTILE_SITE_KEY}></div>

    {#if success}
      <p class="text-success text-lg font-semibold">
        Thank you! We'll reach out to you shortly.
      </p>
    {:else}
      <button type="submit" class="btn btn-primary btn-lg ">
        Get My Inspection <Icon icon="lucide:arrow-right" />
      </button>
    {/if}

    {#if error}
      <p class="text-error">{error}</p>
    {/if}
  </div>
</form>
