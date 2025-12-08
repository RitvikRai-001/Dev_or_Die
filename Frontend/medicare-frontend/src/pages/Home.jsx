import { apiGetDoseLogs, apiMarkDoseTaken } from "../services/api";
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



  const manageRef = useRef(null);

  // -----------------------------
  // THEME SWITCHER
  // -----------------------------
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const switchTheme = (mode) => setTheme(mode);

  // -------------------------------------------------------------------
  // MARK DOSE AS TAKEN → Backend → Reload Schedule
  // -------------------------------------------------------------------
  const markDoseTaken = async ({ capsuleId, scheduledTime }) => {
    try {
      const res = await apiMarkDoseTaken(capsuleId, scheduledTime);

      if (!res.success) {
        alert(res.message || "Failed to mark dose as taken");
        return;
      }

      window.location.reload();//reloads the page

    } catch (err) {
      console.error("Error marking dose taken:", err);
    }
  };

  // -------------------------------------------------------------------
  // LOAD ALL DOSE LOGS FROM BACKEND
  // -------------------------------------------------------------------
  const loadSchedule = useCallback(async () => {
    try {
      const res = await apiGetDoseLogs();

      if (!res.success || !res.logs) return;

      // Convert timestamps → readable UI objects
      const cleaned = res.logs.map((log) => {
        const dt = new Date(log.scheduledTime);

        const yyyy = dt.getFullYear();
        const mm = String(dt.getMonth() + 1).padStart(2, "0");
        const dd = String(dt.getDate()).padStart(2, "0");
        const hh = String(dt.getHours()).padStart(2, "0");
        const min = String(dt.getMinutes()).padStart(2, "0");

        return {
          capsuleId: log.capsuleId?._id,
          name: log.capsuleId?.name || "Medicine",
          date: `${yyyy}-${mm}-${dd}`,
          time: `${hh}:${min}`,
          status: log.status,
          scheduledTime: log.scheduledTime,
        };
      });

      // Sort oldest → newest
      const sorted = cleaned.sort((a, b) => {
        const da = new Date(`${a.date}T${a.time}:00`);
        const db = new Date(`${b.date}T${b.time}:00`);
        return da - db;
      });

      setSchedule(sorted);
    } catch (err) {
      console.error("Error loading dose logs:", err);
    }
  }, []);

  // Load schedule on page load
  useEffect(() => {
    loadSchedule();
  }, [loadSchedule]);

  // -------------------------------------------------------------------
  // SCROLL TO MANAGE SECTION
  // -------------------------------------------------------------------
  const scrollToManage = () => {
    if (manageRef.current) {
      manageRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  return (
    <div className="dashboard-root">
      <TopNav
        username={username}
        notifications={notifications}
        onAddMedicationClick={scrollToManage}
        onThemeSwitch={switchTheme}
        schedule={schedule}
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
          onAddMedication={loadSchedule} // after saving capsule → reload
          onCapsulesUpdated={loadSchedule}
        />
        <AccuracyCircle  />
        <CalendarWidget doses={schedule} />
      </div>

      <div className="bottom-grid">
        <WellnessScore />
      </div>
    </div>
  );
}
