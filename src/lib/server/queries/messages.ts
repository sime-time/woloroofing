import { db } from "$lib/server/db";
import { type messageRole, messages } from "$lib/server/db/schema";

type Message = typeof messages.$inferSelect;
type MessageRole = (typeof messageRole.enumValues)[number];

export async function addMessage({
  leadId,
  content,
  role = "assistant",
}: {
  leadId: string;
  content: string;
  role: MessageRole;
}) {
  const [inserted] = await db
    .insert(messages)
    .values({
      lead_id: leadId,
      content,
      role,
    })
    .returning();

  if (inserted) return inserted as Message;

  throw new Error("AddMessage insert failed");
}

/*
getLeadMessages(leadId)
getRecentLeadMessages(leadId, limit)
getConversationByPhone(phone)
*/
