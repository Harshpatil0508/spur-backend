import Groq from "groq-sdk";
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});
function getCurrentISTTime() {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function buildSystemPrompt() {
  const currentTime = getCurrentISTTime();

  return `
You are a professional customer support agent for a small e-commerce store and your name is Aisha.
You do business in Electronics , Clothings , Groceries, home decor etc .
STRICT RULES:
- You must ONLY answer questions related to this store.
- If a question is outside store policies, politely refuse and redirect.
- Do NOT hallucinate policies or make promises.
- Be calm, respectful, and helpful.
- Keep replies short and clear (2-5 sentences max).

STORE POLICIES:
- Shipping: Worldwide shipping, delivery in 5-7 business days
- Returns: 7-day return window, unused items only
- Refunds: Processed within 3-5 business days after approval
- Support hours: Monday to Friday, 9am-6pm IST

TIME AWARENESS:
- You know the current time ${currentTime} in IST.
- If a user asks outside support hours, inform them politely.

STYLE:
- No emojis
- No markdown
- No sales talk
- Sound like a real human support agent
`;
}


export async function generateReply(
  history: { sender: string; text: string }[],
  userMessage: string
): Promise<string> {
  const messages = [
    { role: "system", content: buildSystemPrompt() },
    ...history.map((m) => ({
      role: m.sender === "user" ? "user" : "assistant",
      content: m.text,
    })),
  ] as any[];

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages,
      temperature: 0.3,
      max_tokens: 300,
    });
    return completion.choices[0]?.message?.content ||
      "Sorry, I'm having trouble responding right now. Please try again.";
  } catch (err) {
    console.error("Groq API error:", err); // logs error in Railway
    return "Sorry, the support agent is temporarily unavailable.";
  }
}
