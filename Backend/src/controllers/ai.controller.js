import { asyncHandler } from "../utils/asyncHandler.js";
import { chatWithAI } from "../ai/services/chat.service.js";


export const chatAI = asyncHandler(async (req, res) => {
  const { question, sessionId } = req.body;

  // 1️⃣ Validate question

  console.log("Chat session:", sessionId);

  if (!question || !question.trim()) {
    return res.status(400).json({
      success: false,
      message: "Question is required",
    });
  }

  // 2️⃣ Validate sessionId (VERY IMPORTANT)
  if (!sessionId) {
    return res.status(400).json({
      success: false,
      message: "sessionId is required for chat memory",
    });
  }

  // 3️⃣ Call AI with sessionId
  const answer = await chatWithAI(question, sessionId);

  // 4️⃣ Respond
  res.status(200).json({
    success: true,
    answer,
  });
});
