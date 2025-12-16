import { ChatPromptTemplate } from "@langchain/core/prompts";
import { Chroma } from "@langchain/community/vectorstores/chroma";
import {embeddings} from "../index.js"
import { llm } from "../llm/ollama.js"


export async function askRAG(question) {
  const vectorStore = await Chroma.fromExistingCollection(
    embeddings,
    {
      collectionName: "medical-knowledge",
      url: "http://localhost:8000",
    }
  );

  const retriever = vectorStore.asRetriever(3);
  const docs = await retriever.invoke(question);
  if (docs.length === 0) {
  return "I don’t have enough information to answer that.";
}


  const context = docs.map(d => d.pageContent).join("\n");

  const prompt = ChatPromptTemplate.fromTemplate(`
You are a health assistant.
Use ONLY the context below.
Do not diagnose or prescribe.

Context:
{context}

Question:
{question}
`);

  const chain = prompt.pipe(llm);
  const res = await chain.invoke({ context, question });

  return res.content;
}
