import mongoose, { Schema } from 'mongoose';

// DoseLog Model
// Purpose: Track whether doses are taken or missed for adherence tracking.

const doseLogSchema = new Schema(
    {
        capsuleId: {
            type: Schema.Types.ObjectId,
            ref: 'Capsule', 
            required: true,
        },

        rangerId: {
            type: Schema.Types.ObjectId,
            ref: 'User', 
            required: true,
            index: true, 
        },

        scheduledTime: {
            type: Date,
            required: true,
            index: true, 
        },

        takenTime: {
            type: Date,
            default: null, 
        },

        status: {
            type: String,
            enum: ['taken', 'missed', 'scheduled'], // 'scheduled' can be used before taken/missed is finalized
            required: true,
            default: 'scheduled',
        },
        reminderSent: {
            type: Boolean,
            default: false
          },
          snoozedUntil: {
            type: Date,
            default: null
          }
          
    },
    
    {timestamps: true,}
);

export const DoseLog = mongoose.model('DoseLog', doseLogSchema);