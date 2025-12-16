import { askRAG } from "../rag/chain.js";

export async function chatWithAI(question, sessionId) {
    if (!sessionId) {
        throw new Error("sessionId is required for chat memory");
    }

    const answer = await askRAG(question, sessionId);
    return answer;
}

