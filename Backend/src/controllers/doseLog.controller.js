import { asyncHandler } from "../utils/asyncHandler.js";
import { DoseLog } from "../models/doseLog.model.js"; 
import { Capsule } from "../models/capsule.model.js"; 


const getScheduledTime = (inputScheduledTime) => {
    if (inputScheduledTime) {
        return new Date(inputScheduledTime);//to make date object
    }
    
    const scheduledTime = new Date();
    scheduledTime.setMinutes(scheduledTime.getMinutes() - 10);
    return scheduledTime;
};


//for /take
const logDoseTake = asyncHandler(async (req, res) => {
    
    const { scheduledTime } = req.body;
    const capsuleId = req.params.capsuleId;
    if (!capsuleId) {
        throw new Error("Capsule ID is required to log a dose.");
    }

   const rangerId = req.user._id; 

    const determinedScheduledTime = getScheduledTime(scheduledTime);

    // Creating the DoseLog entry
    const newDoseLog = await DoseLog.create({
        rangerId,
        capsuleId,
        scheduledTime: determinedScheduledTime,
        takenTime: new Date(), // Actual time of log
        status: 'taken'
    });

    return res.status(201).json({
        success: true,
        message: "Dose logged successfully as taken.",
        doseLog: newDoseLog
    });
});


// --- 2. logDoseMiss: POST /api/v1/doses/miss/:capsuleId ---
const logDoseMiss = asyncHandler(async (req, res) => {
    
    const { scheduledTime } = req.body;
    const capsuleId = req.params.capsuleId;//from url
    
    if (!capsuleId) {
        throw new Error("Capsule ID is required to log a missed dose.");
    }
    
    const rangerId = req.user._id; 
    const determinedScheduledTime = getScheduledTime(scheduledTime);

    const newDoseLog = await DoseLog.create({
        rangerId,
        capsuleId,
        scheduledTime: determinedScheduledTime,
        status: 'missed' 
    });

    return res.status(201).json({
        success: true,
        message: "Dose logged successfully as missed.",
        doseLog: newDoseLog
    });
});

//to get last 50
const getRangerTimeline = asyncHandler(async (req, res) => {
    
    const rangerId = req.user._id;
    
    
    const doseLogs = await DoseLog.find({ rangerId })
        .sort('-scheduledTime') 
        .limit(50) 
        .populate({ // Use Mongoose populate to embed Capsule details (name, dosage,instructions)
            path: 'capsuleId',
            select: 'name dosage instructions'
        }); 
        
    return res.status(200).json({
        success: true,
        results: doseLogs.length,
        logs: doseLogs
    });
});


//stats
const getAdherenceStats = asyncHandler(async (req, res) => {
    
    const rangerId = req.user._id;
    const days = parseInt(req.query.days) || 30; // Default to 30 days lookback
    const lookbackDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000); 

    // MongoDB Aggregation Pipeline for efficient calculation
    const stats = await DoseLog.aggregate([
        {
            // Match: Filter by Ranger ID and time period
            $match: {
                rangerId: rangerId,
                scheduledTime: { $gte: lookbackDate }
            }
        },
        {
            $group: {
                _id: null, 
                totalDoses: { $sum: 1 },
                takenCount: { $sum: { $cond: [{ $eq: ['$status', 'taken'] }, 1, 0] } },
                missedCount: { $sum: { $cond: [{ $eq: ['$status', 'missed'] }, 1, 0] } }
            }
        },
        {
            // Project: Calculate the final adherence percentage
            $project: {
                _id: 0,
                totalDoses: 1,
                takenCount: 1,
                missedCount: 1,
                adherencePercentage: { 
                    $round: [
                        { $multiply: [{ $divide: ["$takenCount", "$totalDoses"] }, 100] }, 
                        1 
                    ]
                }
            }
        }
    ]);

    // Handle case where no doses were logged
    const adherenceData = stats.length > 0 ? stats[0] : { totalDoses: 0, takenCount: 0, missedCount: 0, adherencePercentage: 0 };
    
    return res.status(200).json({
        success: true,
        data: adherenceData
    });
});


// --- Export Controllers ---
export {
    logDoseTake,
    logDoseMiss,
    getRangerTimeline,
    getAdherenceStats
};