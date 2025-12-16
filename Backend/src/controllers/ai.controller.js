import { asyncHandler } from "../utils/asyncHandler.js";
import { chatWithAI } from "../ai/services/chat.service.js";


export const chatAI = asyncHandler(async (req, res) => {
  const { question } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({
      success: false,
      message: "Question is required",
    });
  }

  const answer = await chatWithAI(question);

  res.status(200).json({
    success: true,
    answer,
  });
});
