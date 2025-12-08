import cron from "node-cron";
import { Capsule } from "../models/capsule.model.js";
import { DoseLog } from "../models/doseLog.model.js";

// RUNS EVERY NIGHT AT 00:00
cron.schedule("0 0 * * *", async () => {
  console.log("📅 Running midnight dose scheduler...");

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  const capsules = await Capsule.find({
    startDate: { $lte: tomorrow },
    endDate: { $gte: tomorrow }
  });

  const logs = [];

  for (const cap of capsules) {
    cap.timesOfDay.forEach((t) => {
      const [hour, minute] = t.split(":").map(Number);

      const scheduled = new Date(tomorrow);
      scheduled.setHours(hour, minute, 0, 0);

      logs.push({
        rangerId: cap.rangerId,
        capsuleId: cap._id,
        scheduledTime: scheduled,
        status: "scheduled",
      });
    });
  }

  if (logs.length > 0) {
    await DoseLog.insertMany(logs);
    console.log(`Added ${logs.length} DoseLogs for tomorrow`);
  }
});
