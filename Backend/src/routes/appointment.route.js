import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
    createAppointment,
    getMyAppointments,
    getAppointmentById,
    updateAppointmentStatus,
    updateAppointmentDetails,
    deleteAppointment
} from "../controllers/appointment.controller.js"

const router = Router();

router.use(verifyJWT);
router.route("/").post(createAppointment)
router.route("/").get(getMyAppointments);

router.get("/:id", getAppointmentById);
router.patch("/:id/details", updateAppointmentDetails);
router.patch("/:id/status", updateAppointmentStatus);
router.delete("/:id", deleteAppointment);

export default router;





    
  