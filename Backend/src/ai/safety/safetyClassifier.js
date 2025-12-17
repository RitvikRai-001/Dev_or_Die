import {
  DIAGNOSIS_KEYWORDS,
  PRESCRIPTION_KEYWORDS,
  EMERGENCY_KEYWORDS,
} from "./medicalRules.js";

export function classifyMedicalRisk(question) {
  const q = question.toLowerCase();

  if (EMERGENCY_KEYWORDS.some(k => q.includes(k))) {
    return "EMERGENCY";
  }

  if (DIAGNOSIS_KEYWORDS.some(k => q.includes(k))) {
    return "DIAGNOSIS";
  }

  if (PRESCRIPTION_KEYWORDS.some(k => q.includes(k))) {
    return "PRESCRIPTION";
  }

  return "SAFE";
}
