import express from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addSymptom,
  getSymptoms,
  getSymptomById,
  resolveSymptom,
  deleteSymptom
} from "../controllers/symptom.controller.js";

const router = express.Router();

router.post("/", verifyJWT, addSymptom);
router.get("/", verifyJWT, getSymptoms);
router.get("/:id", verifyJWT, getSymptomById);
router.patch("/:id/resolve", verifyJWT, resolveSymptom);
router.delete("/:id", verifyJWT, deleteSymptom);

export default router;
