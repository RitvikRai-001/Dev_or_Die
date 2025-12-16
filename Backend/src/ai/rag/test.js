import { askRAG } from "./chain.js";

const answer = await askRAG("What happens if I miss my medicine?");
console.log("\n🤖 RAG Answer:\n", answer);
