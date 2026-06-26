import { asc, eq } from "drizzle-orm";
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

export async function getLeadConversation(leadId: string) {
  // Get list of messages, oldest to newest
  const conversation = await db
    .select({ role: messages.role, content: messages.content })
    .from(messages)
    .where(eq(messages.lead_id, leadId))
    .orderBy(asc(messages.created_at));

  if (conversation.length === 0) {
    return [];
  }

  return conversation;
}

/*
getLeadMessages(leadId)
getRecentLeadMessages(leadId, limit)
getConversationByPhone(phone)
*/
