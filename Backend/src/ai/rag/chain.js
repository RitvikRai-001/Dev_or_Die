import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import { embeddings } from "../index.js";
import { llm } from "../llm/ollama.js";
import { getSession } from "../memory/sessionStore.js";
import { formatHistory } from "../memory/formatHistory.js";
import { SAFETY_MESSAGES } from "../safety/safetyResponses.js";
import { classifyMedicalRisk } from "../safety/safetyClassifier.js";

export async function askRAG(question, sessionId) {
  // 0. Safety first
  const risk = classifyMedicalRisk(question);
  if (risk !== "SAFE") {
    return SAFETY_MESSAGES[risk];
  }

  // 1. Load session memory
  const history = getSession(sessionId);
  const historyText = formatHistory(history);

  // 2. Load vector store (SERVER MODE)
  const vectorStore = await Chroma.fromExistingCollection(
    embeddings,
    {
      collectionName: "medical-knowledge",
      url: "http://localhost:8000",
      
    }
  );

  // 3. Similarity search with score
  const results = await vectorStore.similaritySearchWithScore(
    question,
    3
  );

  const THRESHOLD = 1.1;
  const filteredDocs = results.filter(
    ([_, score]) => score < THRESHOLD
  );

  const hasContext = filteredDocs.length > 0;

  const context = hasContext
    ? filteredDocs.map(([doc]) => doc.pageContent).join("\n")
    : "No relevant context found.";

  // 4. Prompt (HYBRID RAG)
  const prompt = ChatPromptTemplate.fromTemplate(`
You are a health assistant.

Rules:
1. If relevant information is present in the context, use ONLY that context.
2. If the context does NOT contain the answer, you may use general medical knowledge.
3. Do NOT diagnose or prescribe medication.
4. Use cautious language like "may", "generally", "commonly".
5. If you are unsure, say: "I do not have enough information to answer that."

Chat history:
{history}

Context:
{context}

Question:
{question}
`);

  // 5. Run LLM
  const chain = prompt.pipe(llm);
  const res = await chain.invoke({
    context,
    question,
    history: historyText,
  });

  // 6. Save conversation
  history.push({ role: "user", content: question });
  history.push({ role: "assistant", content: res.content });

  return res.content;
}
