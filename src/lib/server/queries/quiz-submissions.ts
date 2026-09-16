import { db } from "$lib/server/db";
import { quizSubmissions } from "$lib/server/db/schema";
import type { EstimateQuizAnswers } from "$lib/server/db/schema";
import type { ResultType } from "$lib/server/roof-estimate/calculate";

export async function createQuizSubmissions({
  leadId,
  answers,
  estimateLow,
  estimateHigh,
  resultType,
  customerMessage,
  ownerSummary,
  preferredContact,
  deliveredAt,
}: {
  leadId: string;
  answers: EstimateQuizAnswers;
  estimateLow: number;
  estimateHigh: number;
  resultType: ResultType;
  customerMessage: string;
  ownerSummary: string;
  preferredContact: "sms" | "email";
  deliveredAt?: Date;
}) {
  const [inserted] = await db
    .insert(quizSubmissions)
    .values({
      lead_id: leadId,
      answers,
      estimate_low: estimateLow,
      estimate_high: estimateHigh,
      result_type: resultType,
      customer_message: customerMessage,
      owner_summary: ownerSummary,
      preferred_contact: preferredContact,
      delivered_at: deliveredAt,
    })
    .returning();

  if (inserted) return inserted;

  throw new Error("createQuizSubmissions insert failed");
}
