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

type CalBookingResponse = {
  status: string;
  data: {
    id: number;
    uid: string;
    start: string;
    end?: string;
    duration?: number;
    status?: string;
  };
};

export type TimePreference = "morning" | "afternoon" | "evening" | "anytime";

export type InspectionSlot = {
  start: string;
  end?: string;
  label: string;
};

export type InspectionBooking = {
  id: number;
  uid: string;
  start: string;
  end?: string;
  status?: string;
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
  const url = new URL("/v2/slots", CAL_API_BASE_URL);
  url.searchParams.set("eventTypeId", getCalEventId().toString());
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

export async function bookInspection({
  start,
  name,
  email,
  phone,
  address,
  damageType,
  insuranceProvider,
  notes,
  leadId,
}: {
  start: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  damageType?: string;
  insuranceProvider?: string;
  notes?: string;
  leadId: string;
}): Promise<InspectionBooking> {
  const response = await fetch(`${CAL_API_BASE_URL}/v2/bookings`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${CAL_COM_KEY}`,
      "cal-api-version": "2026-02-25",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      eventTypeId: getCalEventId(),
      start,
      attendee: {
        name,
        email,
        phoneNumber: phone,
        timeZone: CAL_TIME_ZONE,
        language: "en",
      },
      location: {
        type: "attendeeAddress",
        address,
      },
      metadata: {
        leadId,
        phone,
        address,
        damageType,
        insuranceProvider,
      },
      bookingFieldsResponses: {
        notes,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(
      `Cal.com booking request failed: ${response.status} ${await response.text()}`,
    );
  }

  const body = (await response.json()) as CalBookingResponse;

  if (body.status !== "success") {
    throw new Error("Cal.com booking request was not successful");
  }

  return {
    id: body.data.id,
    uid: body.data.uid,
    start: body.data.start,
    end: body.data.end,
    status: body.data.status,
  };
}

function getCalEventId() {
  const eventId = Number(env.CAL_COM_EVENT_ID);

  if (!Number.isInteger(eventId)) {
    throw new Error("CAL_COM_EVENT_ID is not configured");
  }

  return eventId;
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
