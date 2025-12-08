import cron from "node-cron";
import { DoseLog } from "../models/doseLog.model.js";

/**
 * AUTO-MISS CRON JOB
 * Runs every 5 minute:
 * Any scheduled dose older than 30 minutes becomes "missed"
 */

cron.schedule("*/5 * * * *", async () => {
  console.log("⏳ Auto-miss service running...");

  const now = new Date();
  const cutoff = new Date(now.getTime() - 30 * 60 * 1000); // 30 min past time

  try {
    const lateDoses = await DoseLog.find({
      status: "scheduled",          // Only pending doses
      scheduledTime: { $lt: cutoff } // Time has passed + 30 minutes
    });

    if (lateDoses.length === 0) {
      console.log("✔ No auto-miss updates needed.");
      return;
    }

    for (const dose of lateDoses) {
      dose.status = "missed";
      await dose.save();

      console.log(`Auto-marked missed dose: ${dose._id}`);
    }
  } catch (err) {
    console.error("Error in auto-miss cron:", err);
  }
});
