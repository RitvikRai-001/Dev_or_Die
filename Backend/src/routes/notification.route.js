import { Router } from "express";
import {
  getUserNotifications,
  getUnreadCount,
  markNotificationRead,
  markAllRead,
} from "../controllers/notification.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT);

router.get("/", getUserNotifications);

router.get("/unread-count", getUnreadCount);

router.patch("/:id/read", markNotificationRead);

router.patch("/read-all", markAllRead);

export default router;
