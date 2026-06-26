import { anthropic } from "@ai-sdk/anthropic";
import { generateText, stepCountIs } from "ai";
import { findOrCreateLeadByPhone } from "../queries/leads";
import { addMessage, getLeadConversation } from "../queries/messages";
import { buildSystemPrompt } from "./system-prompt";
import { createTools } from "./tools";

export async function respond(phone: string, message: string) {
  // Get lead id from phone number
  const lead = await findOrCreateLeadByPhone(phone);

  // Add lead's message to conversation
  await addMessage({
    leadId: lead.id,
    content: message.trim(),
    role: "user",
  });

  // Get conversation history
  const conversation = await getLeadConversation(lead.id);

  // Build system prompt
  const systemPrompt = buildSystemPrompt();

  // Create agent tools for this specific lead
  const agentTools = createTools(lead);

  // Generate AI response
  const response = await generateText({
    model: anthropic("claude-sonnet-4-5"),
    system: systemPrompt,
    tools: agentTools,
    messages: conversation,
    stopWhen: stepCountIs(3),
  });

  // Add new messages to conversation history in order
  await addMessage({
    leadId: lead.id,
    content: response.text,
    role: "assistant",
  });

  console.log("AI Response", response);

  return response.text;
}
