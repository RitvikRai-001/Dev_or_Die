import { asyncHandler } from "../utils/asyncHandler.js";
import { Capsule } from "../models/capsule.model.js";
import { DoseLog } from "../models/doseLog.model.js";

// ------------------------------
// CREATE CAPSULE
// ------------------------------
const createCapsule = asyncHandler(async (req, res) => {
  const {
    name,
    frequency,     // numeric 1–4
    timesOfDay,    // array like ["08:00","14:00"]
    duration,      // number of days
    instructions,
  } = req.body;

  if (!name || !frequency || !timesOfDay || !duration) {
    throw new Error("Missing required capsule fields.");
  }

  const dosesPerDay = Number(frequency);
  if (!dosesPerDay || dosesPerDay < 1 || dosesPerDay > 4) {
    throw new Error("Invalid frequency option.");
  }

  if (!Array.isArray(timesOfDay) || timesOfDay.length !== dosesPerDay) {
    throw new Error("timesOfDay count must match frequency.");
  }

  // Start date = today 00:00
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  // End date
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (duration - 1));

  const rangerId = req.user._id;

  // Create capsule entry
  const capsule = await Capsule.create({
    rangerId,
    name,
    dosesPerDay,
    timesOfDay,
    startDate,
    endDate,
    instructions: instructions || "",
  });
  // -----------------------------
// CREATE TODAY'S DOSELOGS (ALL TIMES)
// -----------------------------
const now = new Date();
const todayDoseLogs = [];

timesOfDay.forEach((t) => {
  const [hour, minute] = t.split(":").map(Number);

  // Create today's date correctly in local timezone
  const scheduled = new Date();
  scheduled.setHours(hour, minute, 0, 0);

  // Create DoseLog for ALL times
  // Mark as "missed" if time has passed, "scheduled" if upcoming
  todayDoseLogs.push({
    rangerId,
    capsuleId: capsule._id,
    scheduledTime: scheduled,
    status: scheduled < now ? "missed" : "scheduled",
  });
});


  if (todayDoseLogs.length > 0) {
    await DoseLog.insertMany(todayDoseLogs);
    const scheduledCount = todayDoseLogs.filter(d => d.status === "scheduled").length;
    const missedCount = todayDoseLogs.filter(d => d.status === "missed").length;
    console.log(`✅ Created today's DoseLogs: ${scheduledCount} scheduled, ${missedCount} missed`);
  }

  return res.status(201).json({
    success: true,
    message: "Capsule created successfully",
    capsule,
  });
});

// ------------------------------
// GET USER CAPSULES
// ------------------------------
const getRangerCapsules = asyncHandler(async (req, res) => {
  const capsules = await Capsule.find({ rangerId: req.user._id }).sort("startDate");

  return res.status(200).json({
    success: true,
    results: capsules.length,
    capsules,
  });
});

// ------------------------------
// UPDATE CAPSULE
// ------------------------------
const updateCapsule = asyncHandler(async (req, res) => {
  const capsule = await Capsule.findOneAndUpdate(
    { _id: req.params.id, rangerId: req.user._id },
    req.body,
    { new: true, runValidators: true }
  );

  if (!capsule) throw new Error("Capsule not found or unauthorized.");

  return res.status(200).json({
    success: true,
    message: "Capsule updated successfully",
    capsule,
  });
});

// ------------------------------
// DELETE CAPSULE
// ------------------------------
const deleteCapsule = asyncHandler(async (req, res) => {
  const capsule = await Capsule.findOneAndDelete({
    _id: req.params.id,
    rangerId: req.user._id,
  });

  if (!capsule) throw new Error("Capsule not found.");

  return res.status(200).json({
    success: true,
    message: "Capsule deleted successfully",
    deletedId: capsule._id,
  });
});

export {
  createCapsule,
  getRangerCapsules,
  updateCapsule,
  deleteCapsule
};
