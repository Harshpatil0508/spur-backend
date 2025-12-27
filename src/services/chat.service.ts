import prisma from "../db/prisma";
import { generateReply } from "./llm.service";

export async function handleChat(message: string, sessionId?: string) {
  let conversationId: string;

  // Ensure conversation exists
  if (sessionId) {
    const convo = await prisma.conversation.findUnique({
      where: { id: sessionId },
    });

    if (!convo) {
      const newConvo = await prisma.conversation.create({ data: {} });
      conversationId = newConvo.id;
    } else {
      conversationId = convo.id;
    }
  } else {
    const convo = await prisma.conversation.create({ data: {} });
    conversationId = convo.id;
  }

  // Save user message
  await prisma.message.create({
    data: {
      conversationId,
      sender: "user",
      text: message,
    },
  });

  // Fetch history
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
