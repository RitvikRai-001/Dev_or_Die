import mongoose from "mongoose";

const capsuleSchema = new mongoose.Schema(
  {
    rangerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true,
      trim: true
    },

    
    dosesPerDay: {
      type: Number,
      required: true,
      min: 1
    },

    
    timesOfDay: [
      {
        type: String,
        required: true
      }
    ],

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: false
    },

    instructions: {
      type: String,
      trim: true
    }
  },
  { timestamps: true }
);

export const Capsule = mongoose.model("Capsule", capsuleSchema);
