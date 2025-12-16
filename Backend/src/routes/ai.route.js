import {Router} from "express";
import { chatAI } from "../controllers/ai.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";


const router=Router();

router.route("/chat").post(verifyJWT,chatAI);

export default router;