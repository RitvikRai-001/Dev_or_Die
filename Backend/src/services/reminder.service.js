import cron from "node-cron";
import { DoseLog } from "../models/doseLog.model.js";
import { Capsule } from "../models/capsule.model.js";
import { Notification } from "../models/notification.model.js";

cron.schedule("*/1 * * * *", async () => {              
  console.log("⏰ Checking dose reminders...");             

  const now = new Date();                                      
  const next5Min = new Date(now.getTime() + 5 * 60 * 1000);    

  
  const dueDoses = await DoseLog.find({
    status: "scheduled",
    reminderSent: false,
    scheduledTime: { 
      $gte: now,        // ✅ FIXED: Must be in the future (not past)
      $lte: next5Min    // ✅ Within next 5 minutes
    },
  })
    .populate("rangerId")
    .populate("capsuleId");

  console.log(`📋 Found ${dueDoses.length} doses due in next 5 minutes`);

  for (const dose of dueDoses) {
    // Skip if missing required data
    if (!dose.rangerId || !dose.capsuleId) {
      console.log(`⚠️ Skipping dose ${dose._id}: Missing rangerId or capsuleId`);
      continue;
    }

    try {

      await Notification.create({
        user: dose.rangerId._id,
        type: "doseReminder",
        title: "Medicine Reminder",
        message: `It's time to take ${dose.capsuleId.name}`,
      });
      
      dose.reminderSent = true;
      await dose.save();

      console.log(`✅ Notification created for ${dose.capsuleId.name} (Dose: ${dose._id})`);
      
    } catch (err) {
      console.error(`Error creating notification for dose ${dose._id}:`, err);
    }
  }
});
