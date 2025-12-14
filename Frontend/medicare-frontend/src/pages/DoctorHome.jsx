import { useEffect, useState } from "react";
import "../styles/doctor-home.css";
import DoctorTopNav from "../components/DoctorTopNav";

import DashboardHeader from "../components/DashboardHeader";

export default function DoctorHome() {
  const [theme, setTheme] = useState("light");

const user = JSON.parse(localStorage.getItem("user"));
const username = user?.fullname || "Doctor";


  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const switchTheme = (mode) => {
    setTheme(mode);
  };

  return (
    <div className="dashboard-root">
      <DoctorTopNav username={username} onThemeSwitch={switchTheme} />

      {/* Greeting (same UI as patient) */}
      <DashboardHeader username={username} doctor />

      {/* SAME LAYOUT AS PATIENT: top-grid → 4 cards instead of capsules & chat */}
      <div className="top-grid doctor-stats-grid">
        <div className="stat-card card">
          <p className="stat-label">Today's Appointments</p>
          <h2 className="stat-value">0</h2>
        </div>

        <div className="stat-card card">
          <p className="stat-label">Completed This Week</p>
          <h2 className="stat-value">0</h2>
        </div>

        <div className="stat-card card">
          <p className="stat-label">Cancel Rate</p>
          <h2 className="stat-value">0%</h2>
        </div>

        <div className="stat-card card">
          <p className="stat-label">Rangers Under Care</p>
          <h2 className="stat-value">0</h2>
        </div>
      </div>

      {/* UPCOMING APPOINTMENTS (same UI as other cards) */}
      <div className="bottom-grid">
        <div className="card upcoming-card">
          <h3 className="card-title">Upcoming Appointments</h3>

          <table className="upcoming-table">
            <thead>
              <tr>
                <th>Ranger Name</th>
                <th>Date & Time</th>
                <th>Mode</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td colSpan="4" className="empty-row">
                  No upcoming appointments.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
