import prisma  from "../db/prisma";
import { generateReply } from "./llm.service";

export async function handleChat(message: string, sessionId?: string) {
  let conversationId: string;

  if (!sessionId) {
    const convo = await prisma.conversation.create({ data: {} });
    conversationId = convo.id; // now guaranteed to be string
  } else {
    conversationId = sessionId;
  }

  // Create user message
  await prisma.message.create({
    data: {
      conversationId, // ✅ guaranteed string
      sender: "user",
      text: message,
    },
  });

  // Fetch conversation history
  const history = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });

  // Generate AI reply
  const reply = await generateReply(history, message);

  // Save AI reply
  await prisma.message.create({
    data: {
      conversationId,
      sender: "ai",
      text: reply,
    },
  });

  return { reply, sessionId: conversationId };
}
