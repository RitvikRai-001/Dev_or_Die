import { asyncHandler } from "../utils/asyncHandler.js";
import { DoseLog } from "../models/doseLog.model.js";
import { Capsule } from "../models/capsule.model.js";


// --------------------------------------------------
// MARK DOSE AS TAKEN  (update existing log, no duplicates)
// --------------------------------------------------
const logDoseTake = asyncHandler(async (req, res) => {
  const { scheduledTime } = req.body;
  const capsuleId = req.params.capsuleId;
  const rangerId = req.user._id;

  if (!capsuleId || !scheduledTime) {
    throw new Error("Capsule ID and scheduledTime are required.");
  }

  // FIND the scheduled dose
  const existingDose = await DoseLog.findOne({
    rangerId,
    capsuleId,
    scheduledTime: new Date(scheduledTime),
    status: "scheduled",
  });

  if (!existingDose) {
    throw new Error("No scheduled dose found for this time.");
  }

  // UPDATE it
  existingDose.status = "taken";
  existingDose.takenTime = new Date();
  await existingDose.save();

  return res.status(200).json({
    success: true,
    message: "Dose marked as taken.",
    doseLog: existingDose,
  });
});



// --------------------------------------------------
// GET TIMELINE (Last 50 logs)
// --------------------------------------------------
const getRangerTimeline = asyncHandler(async (req, res) => {
  const rangerId = req.user._id;

  const doseLogs = await DoseLog.find({ rangerId })
    .sort("-scheduledTime")
    .limit(50)
    .populate({
      path: "capsuleId",
      select: "name instructions",
    });

  return res.status(200).json({
    success: true,
    results: doseLogs.length,
    logs: doseLogs,
  });
});


// --------------------------------------------------
// ADHERENCE STATS (% taken vs missed)
// --------------------------------------------------
const getAdherenceStats = asyncHandler(async (req, res) => {
  const rangerId = req.user._id;
  const days = parseInt(req.query.days) || 30;

  const lookbackDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const stats = await DoseLog.aggregate([
    {
      $match: {
        rangerId,
        scheduledTime: { $gte: lookbackDate },
      },
    },
    {
      $group: {
        _id: null,
        totalDoses: { $sum: 1 },
        takenCount: {
          $sum: { $cond: [{ $eq: ["$status", "taken"] }, 1, 0] },
        },
        missedCount: {
          $sum: { $cond: [{ $eq: ["$status", "missed"] }, 1, 0] },
        },
      },
    },
    {
      $project: {
        _id: 0,
        totalDoses: 1,
        takenCount: 1,
        missedCount: 1,
        adherencePercentage: {
          $round: [
            {
              $multiply: [
                { $divide: ["$takenCount", "$totalDoses"] },
                100,
              ],
            },
            1,
          ],
        },
      },
    },
  ]);

  const adherenceData =
    stats.length > 0
      ? stats[0]
      : { totalDoses: 0, takenCount: 0, missedCount: 0, adherencePercentage: 0 };

  return res.status(200).json({
    success: true,
    data: adherenceData,
  });
});


export {
  logDoseTake,
  getRangerTimeline,
  getAdherenceStats,
};
