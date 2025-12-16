import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import {embeddings} from "../index.js"
import { llm } from "../llm/ollama.js"
import { getSession } from "../memory/sessionStore.js";
import { formatHistory } from "../memory/formatHistory.js";


export async function askRAG(question, sessionId) {
  // 1. Load session memory
  const history = getSession(sessionId);

  // 2. Load vector store
  const vectorStore = await Chroma.fromExistingCollection(
    embeddings,
    {
      collectionName: "medical-knowledge",
      url: "http://localhost:8000",
      persistDirectory: "./chroma",

    }
  );

  const debug = await vectorStore.similaritySearchWithScore(
  "paracetamol",
  3
);

console.log(
  "DEBUG vectors:",
  debug.map(([doc, score]) => ({
    text: doc.pageContent,
    score,
  }))
);






const results = await vectorStore.similaritySearchWithScore(
  question,
  3
);


const THRESHOLD = 1.1; 
const filteredDocs = results.filter(
  ([_, score]) => score < THRESHOLD
);

if (filteredDocs.length === 0) {
  return "I don’t have enough information to answer that.";
}


const context = filteredDocs
  .map(([doc, score]) => doc.pageContent)
  .join("\n");

  // 5. Format chat history
  const historyText = formatHistory(history);

  // 6. Prompt with memory + RAG
  const prompt = ChatPromptTemplate.fromTemplate(`
You are a health assistant.
Use ONLY the context below.
Answer ONLY using the context below.
If the answer is not in the context, say:
"I do not have enough information to answer that."

Do not diagnose or prescribe.

Chat history:
{history}

Context:
{context}

Question:
{question}
`);

  // 7. Run LLM
  const chain = prompt.pipe(llm);
  const res = await chain.invoke({
    context,
    question,
    history: historyText,
  });

  // 8. Save conversation
  history.push({ role: "user", content: question });
  history.push({ role: "assistant", content: res.content });

  return res.content;
}
