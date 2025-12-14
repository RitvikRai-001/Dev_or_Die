import cron from "node-cron";
import { DoseLog } from "../models/doseLog.model.js";
import { Capsule } from "../models/capsule.model.js";
import { Notification } from "../models/notification.model.js"; // 🔴 ADDED

cron.schedule("*/1 * * * *", async () => {
  console.log("⏰ Checking dose reminders...");

  const now = new Date();
  const next5Min = new Date(now.getTime() + 5 * 60 * 1000);

  const dueDoses = await DoseLog.find({
    status: "scheduled",
    reminderSent: false,
    scheduledTime: { $lte: next5Min },
  })
    .populate("rangerId")
    .populate("capsuleId");

  for (const dose of dueDoses) {
    if (!dose.rangerId || !dose.capsuleId) continue;

    // 🔴 ADDED: prevent duplicate notifications
    const alreadyNotified = await Notification.findOne({
      user: dose.rangerId._id,
      type: "doseReminder",
      createdAt: { $gte: new Date(Date.now() - 10 * 60 * 1000) }, // last 10 min
    });

    if (!alreadyNotified) {
      // 🔴 ADDED: create in-app notification
      await Notification.create({
        user: dose.rangerId._id,
        type: "doseReminder",
        title: "Medicine Reminder",
        message: `It's time to take ${dose.capsuleId.name}`,
      });
    }

    // 🔧 EXISTING LOGIC
    dose.reminderSent = true;
    await dose.save();

    console.log(`🔔 Reminder notification created for Dose ${dose._id}`);
  }
});
