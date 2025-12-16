import { ChatOllama } from "@langchain/ollama";

export const llm = new ChatOllama({
  model: "mistral",
  baseUrl: "http://localhost:11434",
  temperature: 0.3,
});
