import { asyncHandler } from "../utils/asyncHandler.js";
import { Capsule } from "../models/capsule.model.js"; 


//to create capsule
const createCapsule = asyncHandler(async (req, res) => {
    
    const { name, dosage, frequency, timesOfDay, startDate, endDate, instructions } = req.body;
    
    // Simple validation for required fields
    if (!name || !dosage || !frequency || !timesOfDay || !startDate) {
        throw new Error("Missing required capsule schedule fields.");
    }

    // Get the authenticated Ranger ID from the request object
    const rangerId = req.user._id; 

        const newCapsule = await Capsule.create({
            rangerId,
            name,
            dosage,
            frequency,
            timesOfDay,
            startDate,
            endDate,
            instructions
        });

        
        return res.status(201).json({
            success: true,
            message: "Capsule schedule created successfully",
            capsule: newCapsule
        });

    } 
);

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