import { json } from "@sveltejs/kit";
import { Resend } from "resend";
import z from "zod";
import { RESEND_API_KEY } from "$env/static/private";
import {
  DEVPHONE,
  SMS_CONSENT_TEXT,
  WOLOEMAIL,
  WOLOPHONE_HREF,
} from "$lib/contact-info";
import { estimateQuizAnswersSchema } from "$lib/estimate-quiz";
import normalizePhoneToE164 from "$lib/normalize-phone";
import type { EstimateQuizAnswers } from "$lib/server/db/schema";
import { findOrCreateLead } from "$lib/server/queries/leads";
import { addMessage } from "$lib/server/queries/messages";
import { createQuizSubmissions } from "$lib/server/queries/quiz-submissions";
import { calculateRoofEstimate } from "$lib/server/roof-estimate/calculate";
import { sendSMS } from "$lib/server/send-sms";
import type { RequestHandler } from "./$types";

const resend = new Resend(RESEND_API_KEY);

const estimateSchema = z.discriminatedUnion("preferredContact", [
  z.object({
    preferredContact: z.literal("sms"),
    name: z.string().trim().min(1, "Please enter your name."),
    phone: z.string().trim().min(7, "Please enter a phone number we can text."),
    smsConsent: z.literal(true, {
      error: "Please agree to receive texts so we can send your estimate.",
    }),
    answers: estimateQuizAnswersSchema,
  }),
  z.object({
    preferredContact: z.literal("email"),
    name: z.string().trim().min(1, "Please enter your name."),
    email: z.email("Please enter a valid email address."),
    answers: estimateQuizAnswersSchema,
  }),
]);

export const POST: RequestHandler = async ({ request }) => {
  const body = await request.json();
  const validation = estimateSchema.safeParse(body);

  if (!validation.success) {
    return json(
      {
        success: false,
        errors: validation.error.issues,
      },
      { status: 400 },
    );
  }

  const input = validation.data;
  const answers = input.answers as EstimateQuizAnswers;

  try {
    let normalizedPhone: string | undefined;

    if (input.preferredContact === "sms") {
      const phone = normalizePhoneToE164(input.phone);

      if (!phone) {
        return json(
          {
            success: false,
            errors: [
              {
                message: "Please enter a valid 10-digit phone number.",
              },
            ],
          },
          { status: 400 },
        );
      }

      normalizedPhone = phone;
    }

    const leadContact = {
      name: input.name,
      phone: normalizedPhone,
      email: input.preferredContact === "email" ? input.email : undefined,
      preferredContact: input.preferredContact,
      smsConsent: input.preferredContact === "sms" ? input.smsConsent : false,
    };

    const estimate = calculateRoofEstimate(answers, leadContact);

    const lead = await findOrCreateLead({
      name: input.name,
      preferred_contact: input.preferredContact,
      phone: normalizedPhone,
      email: input.preferredContact === "email" ? input.email : undefined,
      sms_consent: input.preferredContact === "sms" ? input.smsConsent : false,
      sms_consent_text:
        input.preferredContact === "sms" ? SMS_CONSENT_TEXT : undefined,
      sms_consent_at: input.preferredContact === "sms" ? new Date() : undefined,
      message: estimate.customerMessage,
    });

    if (input.preferredContact === "sms") {
      if (!normalizedPhone) {
        throw new Error("SMS estimate lead is missing a normalized phone number");
      }

      await sendSMS(normalizedPhone, estimate.customerMessage);
      await addMessage({
        leadId: lead.id,
        content: estimate.customerMessage,
        role: "assistant",
      });
    } else {
      const { error } = await resend.emails.send({
        from: "WOLO Roofing Estimates <leads@updates.woloroofing.com>",
        to: [input.email],
        replyTo: WOLOEMAIL,
        subject: "Your WOLO Roofing Estimate",
        text: estimate.customerMessage,
      });

      if (error) {
        throw new Error(`Estimate email failed: ${error.message}`);
      }
    }

    await createQuizSubmissions({
      leadId: lead.id,
      answers,
      estimateLow: estimate.estimateLow,
      estimateHigh: estimate.estimateHigh,
      resultType: estimate.resultType,
      customerMessage: estimate.customerMessage,
      ownerSummary: estimate.ownerSummary,
      preferredContact: input.preferredContact,
      deliveredAt: new Date(),
    });

    try {
      const ownerPhone = WOLOPHONE_HREF.replace("tel:", "");
      await sendSMS(ownerPhone, estimate.ownerSummary);
      await sendSMS(DEVPHONE, estimate.ownerSummary);
    } catch (err) {
      console.error("Estimate owner notification failed:", err);
    }

    return json({ success: true });
  } catch (err) {
    console.error("Estimate submission failed:", err);

    return json(
      {
        success: false,
        errors: [
          {
            message:
              "Your estimate could not be sent. Please refresh the page and try again.",
          },
        ],
      },
      { status: 500 },
    );
  }
};
