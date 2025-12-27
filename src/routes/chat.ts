import { Router } from "express";
import { handleChat } from "../services/chat.service";
import prisma from "../db/prisma";

const router = Router();

router.post("/message", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({ error: "Message cannot be empty" });
    }

    const result = await handleChat(message.trim(), sessionId);
    res.json(result);

  } catch (err) {
    console.error("Chat error:", err);
    res.status(500).json({
      reply: "Support agent is temporarily unavailable."
    });
  }
});



router.get("/history/:sessionId", async (req, res) => {
  try {
    const { sessionId } = req.params;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    const messages = await prisma.message.findMany({
      where: { conversationId: sessionId },
      orderBy: { createdAt: "asc" },
      select: {
        sender: true,
        text: true,
        createdAt: true
      }
    });

    res.json({ messages });
  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ error: "Unable to fetch chat history" });
  }
});

export default router;
