import type { EstimateQuizAnswers } from "$lib/server/db/schema";
import type { ResultType } from "./calculate";

export function formatEstimateRange(low: number, high: number) {
  return `$${low.toLocaleString()}-$${high.toLocaleString()}`;
}

export function roundDownToNearest500(value: number) {
  return Math.floor(value / 500) * 500;
}

export function roundUpToNearest500(value: number) {
  return Math.ceil(value / 500) * 500;
}

export function getResultType(answers: EstimateQuizAnswers): ResultType {
  if (answers.helpWith === "Storm, wind, or hail damage") {
    return "storm_damage";
  }

  if (answers.helpWith === "Gutters, siding, or exterior damage") {
    return "exterior_only";
  }

  if (answers.helpWith === "Full roof replacement") {
    return "roof_replacement";
  }

  if (
    answers.helpWith === "Roof leak" ||
    answers.helpWith === "Missing or damaged shingles" ||
    answers.roofCondition === "Leak or ceiling stains" ||
    answers.roofCondition === "Missing shingles"
  ) {
    return "possible_repair";
  }

  return "general";
}

export function buildCustomerMessage(
  name: string | undefined,
  range: string,
  resultType: ResultType,
  preferredContact: "sms" | "email",
) {
  const greeting = name ? `Hi ${name}, ` : "";

  let body = `${greeting}based on your answers, a roof like yours is commonly in the ${range} range.\n\nFinal price depends on exact roof measurements, pitch, materials, decking condition, and inspection findings.`;

  if (resultType === "storm_damage") {
    body = `${greeting}based on your answers, a roof like yours is commonly in the ${range} range.\n\nIf storm damage is confirmed, your final out-of-pocket cost may depend on your insurance coverage and inspection findings.`;
  }

  if (resultType === "possible_repair") {
    body = `${greeting}based on your answers, a full roof replacement could commonly fall around ${range}.\n\nA free inspection can confirm whether this is a repair or replacement situation.`;
  }

  if (resultType === "exterior_only") {
    body = `${greeting}based on your answers, exterior or related roofing work could commonly fall around ${range}.\n\nA free inspection can confirm the exact scope and whether roof, gutter, siding, or storm repairs are needed.`;
  }

  if (preferredContact === "sms") {
    return `${body}\n\nIf you want, just reply here and I can help schedule a free WOLO roof inspection.`;
  }

  return `${body}\n\nYou can schedule a free WOLO roof inspection here:\nhttps://www.woloroofing.com/schedule-inspection`;
}

export function buildOwnerSummary(
  answers: EstimateQuizAnswers,
  lead: {
    name?: string;
    phone?: string;
    email?: string;
    preferredContact: "sms" | "email";
  },
  range: string,
) {
  return [
    "New Estimate Quiz Lead",
    "",
    `Name: ${lead.name ?? "Unknown"}`,
    `Phone: ${lead.phone ?? "Not provided"}`,
    `Email: ${lead.email ?? "Not provided"}`,
    `Estimate: ${range}`,
    "",
    `Need: ${answers.helpWith}`,
    `Location: ${answers.location}`,
    `Roof Age: ${answers.roofAge}`,
    `Roof Type: ${answers.roofType}`,
    `Home Size: ${answers.homeSize}`,
    `Stories: ${answers.stories}`,
    `Roof Complexity: ${answers.roofComplexity}`,
    `Condition: ${answers.roofCondition}`,
    `Insurance: ${answers.insurance}`,
    `Timeline: ${answers.timeline}`,
  ].join("\n");
}
