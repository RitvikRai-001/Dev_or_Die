import { asyncHandler } from "../utils/asyncHandler.js";
import { Capsule } from "../models/capsule.model.js"; 


//to create capsule
const createCapsule = asyncHandler(async (req, res) => {
  const {
    name,          // "Paracetamol 500mg"
    frequency,     // text: "Once a day", "Twice a day", "3 times a day", "4 times a day"
    timesOfDay,    // ["08:00", "20:00", ...]
    duration,      // number of days
    instructions,  // optional
  } = req.body;

  if (!name || !frequency || !timesOfDay || !duration) {
    throw new Error("Missing required capsule fields.");
  }

  const dosesPerDay = Number(frequency);

if (!dosesPerDay || dosesPerDay < 1 || dosesPerDay > 4) {
  throw new Error("Invalid frequency option.");
}





  const totalDays = Number(duration);
  if (Number.isNaN(totalDays) || totalDays < 1) {
    throw new Error("Duration must be at least 1 day.");
  }

  if (!Array.isArray(timesOfDay) || timesOfDay.length !== dosesPerDay) {
    throw new Error("timesOfDay count must match the selected frequency.");
  }

  // Start today at midnight
  const startDate = new Date();
  startDate.setHours(0, 0, 0, 0);

  // End after (duration - 1) days
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + (totalDays - 1));

  const rangerId = req.user._id;

  const newCapsule = await Capsule.create({
    rangerId,
    name,
    dosesPerDay,       // numeric
    timesOfDay,        // array of strings
    startDate,
    endDate,
    instructions: instructions || "",
  });

  return res.status(201).json({
    success: true,
    message: "Capsule schedule created successfully",
    capsule: newCapsule,
  });
});


//to get all capsules related to user
const getRangerCapsules = asyncHandler(async (req, res) => {
    
    const rangerId = req.user._id;
    
        const capsules = await Capsule.find({ rangerId }).sort('startDate');

        return res.status(200).json({
            success: true,
            results: capsules.length,
            capsules: capsules
        });
    } 
);

//to update capsule
const updateCapsule = asyncHandler(async (req, res) => {
    const capsuleId = req.params.id;
    const rangerId = req.user._id;

  
        const updatedCapsule = await Capsule.findOneAndUpdate(
            { _id: capsuleId, rangerId }, 
            req.body,                     
            { new: true, runValidators: true } 
        );

        // 2. Check if the capsule was found and updated
        if (!updatedCapsule) {
            throw new Error("Capsule not found or you are not authorized to update it.");
        }

        return res.status(200).json({
            success: true,
            message: "Capsule schedule updated successfully",
            capsule: updatedCapsule
        });

    } );

//to delete
const deleteCapsule = asyncHandler(async (req, res) => {
    const capsuleId = req.params.id;
    const rangerId = req.user._id;

 
        const deletedCapsule = await Capsule.findOneAndDelete({ _id: capsuleId, rangerId });

        if (!deletedCapsule) {
            throw new Error("Capsule not found or you are not authorized to delete it.");
        }

            return res.status(200).json({
            success: true,
            message: "Capsule schedule deleted successfully",
            deletedId: capsuleId
        });

    } );


export {
    createCapsule,
    getRangerCapsules,
    updateCapsule,
    deleteCapsule
};