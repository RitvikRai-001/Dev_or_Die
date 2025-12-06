import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
  {
    rangerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    dateTime: {
      type: Date,
      required: true,
      index: true
    },

    mode: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
      required: true
    },

    notes: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled"],
      default: "scheduled",
      index: true
    }
  },
  { timestamps: true }
);


export const Appointment = mongoose.model("Appointment", appointmentSchema);
