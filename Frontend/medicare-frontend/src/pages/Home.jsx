import { apiGetCapsules } from "../services/api";
import { generateDosesFromCapsule } from "../utils/generateDoses";

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
  const [schedule, setSchedule] = useState([]);
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

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const switchTheme = (mode) => {
    setTheme(mode);
  };

  const addMedication = (medObj) => {
    const { name, schedule: rawSchedule } = medObj;
    if (!rawSchedule || !rawSchedule.length) return;

    const newEntries = rawSchedule.map((entry) => {
      const dt = new Date(entry.time);

      const yyyy = dt.getFullYear();
      const mm = String(dt.getMonth() + 1).padStart(2, "0");
      const dd = String(dt.getDate()).padStart(2, "0");
      const hh = String(dt.getHours()).padStart(2, "0");
      const min = String(dt.getMinutes()).padStart(2, "0");

      return {
        id: `${name}-${yyyy}${mm}${dd}-${hh}${min}-${Math.random()}`,
        name,
        date: `${yyyy}-${mm}-${dd}`,
        time: `${hh}:${min}`,
        status: entry.status || "pending",
      };
    });

    setSchedule((prev) => [...prev, ...newEntries]);
  };

  const markDoseTaken = (id) => {
    setSchedule((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "done" } : d))
    );
  };

  const loadCapsules = useCallback(async () => {
    try {
      const res = await apiGetCapsules();
      if (!res.success || !res.capsules) return;

      const allDoses = res.capsules.flatMap((cap) =>
        generateDosesFromCapsule(cap)
      );

      setSchedule(allDoses);
    } catch (err) {
      console.error("Error loading capsules:", err);
    }
  }, []);

  useEffect(() => {
    loadCapsules();
  }, [loadCapsules]);

  const autoUpdateStatusAndNotifications = () => {
    const now = new Date();

    const updated = schedule.map((d) => {
      if (d.status === "done") return d;

      const doseDateTime = new Date(`${d.date}T${d.time}:00`);
      const diffMinutes = (now - doseDateTime) / 60000;

      if (diffMinutes > 30) {
        return { ...d, status: "missed" };
      }
      return d;
    });

    const newNotifications = updated
      .map((d) => {
        const doseDateTime = new Date(`${d.date}T${d.time}:00`);
        const diffMinutes = (doseDateTime - now) / 60000;

        if (d.status === "missed") {
          return {
            type: "missed",
            message: `${d.name} at ${d.time} missed`,
          };
        }

        if (Math.abs(diffMinutes) <= 10 && d.status === "pending") {
          return {
            type: "due",
            message: `${d.name} at ${d.time} is due now`,
          };
        }

        return null;
      })
      .filter(Boolean);

    setSchedule(updated);
    setNotifications(newNotifications);
  };

  useEffect(() => {
    autoUpdateStatusAndNotifications();
    const id = setInterval(autoUpdateStatusAndNotifications, 60000);
    return () => clearInterval(id);
  }, [schedule.length]);

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
          onAddMedication={addMedication}
          onCapsulesUpdated={loadCapsules}
        />
        <AccuracyCircle doses={schedule} />
        <CalendarWidget doses={schedule} />
      </div>

      <div className="bottom-grid">
        <WellnessScore />
      </div>
    </div>
  );
}
