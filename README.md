# Spur Chat Backend

A production-ready Node.js and Express backend for an AI-powered customer support chat system.
This service uses Groq LLM and Prisma ORM to provide session-based conversations for an e-commerce platform.

The AI behaves like a real customer support agent and strictly follows predefined store policies.

---

## Features

- AI-powered customer support agent using Groq (LLaMA 3.1)
- Session-based chat with persistent message history
- Strict system prompt with store policies
- Time-aware responses based on IST
- REST APIs for chat and history
- CORS configured for Vercel frontend
- Health check endpoint for monitoring

## Tech Stack

- Node.js
- Express.js
- TypeScript
- Prisma ORM
- Groq SDK
- PostgreSQL


## Project Structure


```text
src/
├── db/
│   └── prisma.ts
├── routes/
│   └── chat.ts
├── services/
│   ├── chat.service.ts
│   └── llm.service.ts
├── server.ts

prisma/
└── schema.prisma
```

## Clone the Repository
```
git clone https://github.com/Harshpatil0508/spur-backend.git
cd spur-backend
```
## Environment Variables

### Create a .env file in the project root:

```
PORT=3001
DATABASE_URL=your_database_url
GROQ_API_KEY=your_groq_api_key
```

## Installation

### Install dependencies:
```
npm install
```

### Generate Prisma client:
```
npx prisma generate
```

### Run database migrations:
```
npx prisma migrate dev
```
---

## Running the Server

### Development
```
npm run dev
```
### Production
```
npm run build
npm start
```
### Server runs on:

- http://localhost:3001

## API Endpoints

### Health Check

- GET /health

- Response:
```
{
"status": "ok"
}
```
---

### Send Chat Message

- POST /chat/message

- Request Body:
```
{
"message": "Where is my order?",
"sessionId": "session-id"
}
```
- Response:

```
{
"reply": "Your order will be delivered within 5–7 business days.",
"sessionId": "conversation-id"
}
```

### Fetch Chat History

- GET /chat/history/:sessionId

- Response:

```
{
"messages": [
{
"sender": "user",
"text": "Hi",
"createdAt": "2025-01-01T10:00:00Z"
},
{
"sender": "ai",
"text": "Hello, how can I help you?",
"createdAt": "2025-01-01T10:00:02Z"
}
]
}
```

## AI Behavior

### The AI support agent:

- Acts as a professional customer support executive

- Answers only store-related questions

- Follows strict store policies

- Politely refuses out-of-scope queries

- Keeps responses short and clear

- No emojis, no markdown, no hallucinated content


## Frontend Integration

### CORS is configured for:

- https://spur-frontend-rouge.vercel.app


