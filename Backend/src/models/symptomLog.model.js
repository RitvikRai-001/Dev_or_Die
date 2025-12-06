import mongoose from "mongoose";

const symptomLogSchema = new mongoose.Schema(
  {
    rangerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    symptomName: {
      type: String,
      required: true,
      trim: true
    },

    severity: {
      type: Number,
      min: 1,
      max: 5,
      required: true
    },

    notes: {
      type: String,
      maxlength: 300,
      trim: true
    },

    urgency: {
      type: Boolean,
      default: false
    },

    predictedCondition: {
      type: String,
      default: null
    },

    status: {
      type: String,
      enum: ["active", "resolved"],
      default: "active"
    },

    tags: [
      {
        type: String,
        trim: true
      }
    ],

    loggedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export const SymptomLog = mongoose.model("SymptomLog", symptomLogSchema);
