import { useEffect, useState } from "react";
import "../styles/header.css";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 17 || hour < 4) return "Good Evening";
  if (hour >= 4 && hour < 12) return "Good Morning";
  return "Good Afternoon";
}

export default function DashboardHeader({ username }) {
  const [greeting, setGreeting] = useState(getGreeting());

  useEffect(() => {
    const id = setInterval(() => setGreeting(getGreeting()), 60000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="dashboard-header">
      <p className="header-label">HEALTH DASHBOARD</p>
      <h1 className="header-title">
        {greeting}, {username} <span className="wave"></span>
      </h1>
      <p className="header-subtitle">
        Track your health and stay mission-ready.
      </p>
    </header>
  );
}
