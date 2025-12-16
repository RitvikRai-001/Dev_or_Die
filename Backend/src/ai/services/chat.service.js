import { askRAG } from "../rag/chain.js";

export async function chatWithAI(question) {
    const answer=await askRAG(question);
    return answer;
}
