import path from "path";
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";



const app=express();


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials: true,
}));

//services import

 import "./services/reminder.service.js"
import "./services/autoMiss.service.js";
import "./services/doseScheduler.service.js";

//routes import
import userAuthRouter from "./routes/auth.route.js"
import userRouter from "./routes/user.route.js"
import symptomRouter from "./routes/symptom.route.js"
import capsuleRouter from "./routes/capsule.route.js"
import appointmentRouter from "./routes/appointment.route.js"
import doseLogRouter from "./routes/doseLog.route.js"
import notificationRouter from "./routes/notification.route.js";
import aiRouter from "./routes/ai.route.js"








//routes declaration
app.use("/api/auth",userAuthRouter)
app.use("/api/user",userRouter)
app.use("/api/symptom",symptomRouter)
app.use("/api/capsule",capsuleRouter)
app.use("/api/appointment",appointmentRouter)
app.use("/api/doseLog",doseLogRouter)
app.use("/api/notification", notificationRouter);
app.use("/api/ai",aiRouter)


app.get("/",(req,res)=>{
  res.send("Hey Ladies")
}
);




app.use((err,req,res,next)=>{
    console.error(err.stack);

  res.status(400).json({
    success: false,
    message: err.message || "Something went wrong",
  });


});


export {app};