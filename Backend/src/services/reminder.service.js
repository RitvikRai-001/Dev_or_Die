import cron from "node-cron";
import { DoseLog } from "../models/doseLog.model";
import { Capsule } from "../models/capsule.model";
// import { sendEmail } from "../utils/sendEmail.js";




cron.schedule("*/1 * * * *", async () => {
  console.log(" Checking dose reminders...");

  const now = new Date();
  const next5Min = new Date(now.getTime() + 5 * 60 * 1000);

  const dueDoses = await DoseLog.find({
    status: "scheduled",
    reminderSent: false,
    scheduledTime: { $lte: next5Min }
  })
    .populate("rangerId")
    .populate("capsuleId");

  for (const dose of dueDoses) {
    if (!dose.rangerId || !dose.capsuleId) continue;

    const userEmail = dose.rangerId.email;
    const capsuleName = dose.capsuleId.name;

    // await sendEmail(
    //   userEmail,
    //   "Medicine Reminder",
    //   `It's time to take your capsule: ${capsuleName}`
    // );

    dose.reminderSent = true;
    await dose.save();
    console.log(`Reminder sent for Dose ${dose._id}`);
  }
});
