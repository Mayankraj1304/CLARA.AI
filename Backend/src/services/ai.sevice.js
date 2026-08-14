import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const geminiModel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: "process.env.GEMINI_API_KEY",
});

const mistralModel = new ChatMistralAI({
model: "mistral-small-latest",
temperature: 0
});