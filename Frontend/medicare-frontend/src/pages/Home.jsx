import {
  apiGetDoseLogs,
  apiMarkDoseTaken,
  apiGetNotifications,
} from "../services/api";
import { useEffect, useRef, useState, useCallback } from "react";
import "../styles/dashboard.css";

import TopNav from "../components/TopNav";
import DashboardHeader from "../components/DashboardHeader";
import CapsuleList from "../components/CapsuleList";
import ManageMedicines from "../components/ManageMedicines";
import CalendarWidget from "../components/CalendarWidget";
import WellnessScore from "../components/WellnessScore";
import ChatBox from "../components/ChatBox";
import AccuracyCircle from "../components/AccuracyCircle";

export default function Home() {
  const [theme, setTheme] = useState("light");
  const [schedule, setSchedule] = useState([]); // dose logs from backend
  const [notifications, setNotifications] = useState([]);
  const [username, setUsername] = useState("User");

  const manageRef = useRef(null);

  // --------------------------------------------------
  // LOAD USER NAME FROM LOCAL STORAGE (unchanged)
  // --------------------------------------------------
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const u = JSON.parse(stored);
        setUsername(u.fullname || u.username || "User");
      } catch (err) {
        console.error("Error parsing user from localStorage:", err);
      }
    }
  }, []);

  // --------------------------------------------------
  // 🔥 NEW: CENTRALIZED NOTIFICATION FETCH FUNCTION
  // WHY:
  // - Avoid duplicate logic
  // - Used by polling + after dose taken + TopNav callbacks
  // --------------------------------------------------
  const refreshNotifications = async () => {
    try {
      const res = await apiGetNotifications();
      if (res.success) {
        setNotifications(res.notifications);
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  // --------------------------------------------------
  // POLL NOTIFICATIONS EVERY 30 SECONDS
  // WHY:
  // - Backend cron runs independently
  // - Keeps UI updated without reload
  // --------------------------------------------------
  useEffect(() => {
    refreshNotifications(); // initial fetch

    const interval = setInterval(refreshNotifications, 30000);

    return () => clearInterval(interval);
  }, []);

  // --------------------------------------------------
  // THEME SWITCHER (unchanged)
  // --------------------------------------------------
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const switchTheme = (mode) => setTheme(mode);

  // --------------------------------------------------
  // LOAD ALL DOSE LOGS FROM BACKEND
  // --------------------------------------------------
  const loadSchedule = useCallback(async () => {
    try {
      const res = await apiGetDoseLogs();
      if (!res.success || !res.logs) return;

      const cleaned = res.logs.map((log) => {
        const dt = new Date(log.scheduledTime);

        return {
          capsuleId: log.capsuleId?._id,
          name: log.capsuleId?.name || "Medicine",
          date: dt.toISOString().slice(0, 10),
          time: dt.toTimeString().slice(0, 5),
          status: log.status,
          scheduledTime: log.scheduledTime,
        };
      });

      cleaned.sort(
        (a, b) =>
          new Date(a.scheduledTime) - new Date(b.scheduledTime)
      );

      setSchedule(cleaned);
    } catch (err) {
      console.error("Error loading dose logs:", err);
    }
  }, []);

  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  // --------------------------------------------------
  // ✅ UPDATED: MARK DOSE AS TAKEN
  // ❌ REMOVED window.location.reload()
  // WHY:
  // - Reload breaks notification polling
  // - Resets React state
  // - Causes unread badge bugs
  // --------------------------------------------------
  const markDoseTaken = async ({ capsuleId, scheduledTime }) => {
    try {
      const res = await apiMarkDoseTaken(capsuleId, scheduledTime);

      if (!res.success) {
        alert(res.message || "Failed to mark dose as taken");
        return;
      }

      // ✅ Correct way: re-fetch data
      await loadSchedule();
      await refreshNotifications();

      /*
      ❌ OLD (removed):
      window.location.reload();

      WHY REMOVED:
      - Bad UX
      - Breaks notification logic
      - Not needed in React
      */
    } catch (err) {
      console.error("Error marking dose taken:", err);
    }
  };

  // --------------------------------------------------
  // SCROLL TO MANAGE SECTION (unchanged)
  // --------------------------------------------------
  const scrollToManage = () => {
    if (manageRef.current) {
      manageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  // --------------------------------------------------
  // RENDER
  // --------------------------------------------------
  return (
    <div className="dashboard-root">
      <TopNav
        username={username}
        notifications={notifications}
        onAddMedicationClick={scrollToManage}
        onThemeSwitch={switchTheme}
        schedule={schedule}
        onNotificationsRead={refreshNotifications} // ✅ NEW: for TopNav actions
      />

      <DashboardHeader username={username} />

      <div className="top-grid">
        <div className="left-side">
          <CapsuleList doses={schedule} onMarkTaken={markDoseTaken} />
        </div>

        <div className="right-side">
          <ChatBox />
        </div>
      </div>

      <div className="middle-grid" ref={manageRef}>
        <ManageMedicines
          onAddMedication={loadSchedule}
          onCapsulesUpdated={loadSchedule}
        />

        {/* AccuracyCircle now fetches adherence itself */}
        <AccuracyCircle />

        <CalendarWidget doses={schedule} />
      </div>

      <div className="bottom-grid">
        <WellnessScore />
      </div>
    </div>
  );
}
