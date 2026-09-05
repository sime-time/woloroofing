import { env } from "$env/dynamic/private";
import { CAL_COM_KEY } from "$env/static/private";

const CAL_API_BASE_URL = "https://api.cal.com";
const CAL_TIME_ZONE = "America/Indiana/Indianapolis";

type CalSlot = {
  start: string;
  end?: string;
};

type CalSlotsResponse = {
  status: string;
  data: Record<string, CalSlot[]>;
};

export type TimePreference = "morning" | "afternoon" | "evening" | "anytime";

export type InspectionSlot = {
  start: string;
  end?: string;
  label: string;
};

export async function getAvailableInspectionSlots({
  startDate,
  endDate,
  timePreference = "anytime",
}: {
  startDate: string;
  endDate: string;
  timePreference?: TimePreference;
}) {
  const eventTypeId = env.CAL_COM_EVENT_ID;

  if (!eventTypeId) {
    throw new Error("CAL_COM_EVENT_ID is not configured");
  }

  const url = new URL("/v2/slots", CAL_API_BASE_URL);
  url.searchParams.set("eventTypeId", eventTypeId);
  url.searchParams.set("start", startDate);
  url.searchParams.set("end", endDate);
  url.searchParams.set("timeZone", CAL_TIME_ZONE);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${CAL_COM_KEY}`,
      "cal-api-version": "2024-09-04",
    },
  });

  if (!response.ok) {
    throw new Error(`Cal.com slots request failed: ${response.status}`);
  }

  const body = (await response.json()) as CalSlotsResponse;

  if (body.status !== "success") {
    throw new Error("Cal.com slots request was not successful");
  }

  return Object.values(body.data)
    .flat()
    .filter((slot) => matchesTimePreference(slot.start, timePreference))
    .slice(0, 4)
    .map((slot) => ({
      start: slot.start,
      end: slot.end,
      label: formatSlot(slot.start),
    }));
}

function matchesTimePreference(start: string, preference: TimePreference) {
  if (preference === "anytime") return true;

  const hour = Number(
    new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      hour12: false,
      timeZone: CAL_TIME_ZONE,
    }).format(new Date(start)),
  );

  if (preference === "morning") return hour >= 8 && hour < 12;
  if (preference === "afternoon") return hour >= 12 && hour < 17;

  return hour >= 17 && hour < 20;
}

function formatSlot(start: string) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: CAL_TIME_ZONE,
  }).format(new Date(start));
}
