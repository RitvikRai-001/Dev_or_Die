import { asyncHandler } from "../utils/asyncHandler.js";
import { SymptomLog } from "../models/symptomLog.model.js";

const addSymptom = asyncHandler(async (req, res) => {
    const { symptomName, severity, notes, urgency, tags, loggedAt } = req.body;
  
    if (!symptomName) throw new Error("Symptom name is required");
    if (!severity || severity < 1 || severity > 5) {
      throw new Error("Severity must be between 1 and 5");
    }
  
    const newSymptom = await SymptomLog.create({
      rangerId: req.user._id,
      symptomName,
      severity,
      notes,
      urgency,
      tags,
      loggedAt
    });
  
    return res.status(201).json({
      success: true,
      message: "Symptom logged successfully",
      symptom: newSymptom
    });
  });

  // Get Symptoms of the User-->

  const getSymptoms = asyncHandler(async (req, res) => {
    const symptoms = await SymptomLog.find({ rangerId: req.user._id })
      .sort({ loggedAt: -1 });
  
    return res.status(200).json({
      success: true,
      symptoms
    });
  });
  
  // Fetch Single Symptom by ID

  const getSymptomById = asyncHandler(async (req, res) => {
    const symptom = await SymptomLog.findById(req.params.id);
  
    if (!symptom || symptom.rangerId.toString() !== req.user._id.toString()) {
      throw new Error("Symptom not found");
    }
  
    return res.status(200).json({
      success: true,
      symptom
    });
  });
  

  const resolveSymptom = asyncHandler(async (req, res) => {
    const symptom = await SymptomLog.findById(req.params.id);
  
    if (!symptom || symptom.rangerId.toString() !== req.user._id.toString()) {
      throw new Error("Not allowed to update this symptom");
    }
  
    symptom.status = "resolved";
    await symptom.save();
  
    return res.status(200).json({
      success: true,
      message: "Symptom marked as resolved",
      symptom
    });
  });


  const deleteSymptom = asyncHandler(async (req, res) => {
    const symptom = await SymptomLog.findById(req.params.id);
  
    if (!symptom || symptom.rangerId.toString() !== req.user._id.toString()) {
      throw new Error("Not allowed to delete this symptom");
    }
  
    await symptom.deleteOne();
  
    return res.status(200).json({
      success: true,
      message: "Symptom deleted successfully"
    });
  });
  

  
export {
    addSymptom,
    getSymptoms,
    getSymptomById,
    resolveSymptom,
    deleteSymptom
  };

  
  
  

