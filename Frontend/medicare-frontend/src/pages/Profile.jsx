import React, { useState } from "react";
import "../styles/profile.css";
import TopNav from "../components/TopNav";

export default function Profile({ theme, onThemeSwitch }) {
  const username = localStorage.getItem("username") || "User";
  const email = localStorage.getItem("email") || "example@mail.com";

  const [form, setForm] = useState({
    gender: "",
    age: "",
    weight: "",
    height: "",
    conditions: "",
    allergies: "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const saveChanges = () => {
    alert("Profile saved!");
  };

  return (
    <div className="profile-page">
      <TopNav username={username} onThemeSwitch={onThemeSwitch} />

      <div className="profile-content">
        <div className="card profile-card">
          <div className="profile-identity-card">
            <div className="profile-avatar">
              {username.charAt(0).toUpperCase()}
            </div>

            <div className="profile-main-info">
              <p className="profile-name">{username}</p>
              <p className="profile-email">{email}</p>
              <p className="profile-joined">Joined: Dec 2025</p>
            </div>

            <button className="profile-edit-photo-btn">
              Edit Photo (coming soon)
            </button>
          </div>
        </div>
        <div className="profile-layout">
          <div className="card profile-card">
            <h3>Personal Details</h3>

            <div className="profile-form-grid">
              <div className="pf-field">
                <label>Full Name</label>
                <input className="pf-input" value={username} disabled />
              </div>

              <div className="pf-field">
                <label>Email</label>
                <input className="pf-input" value={email} disabled />
              </div>

              <div className="pf-field">
                <label>Gender</label>
                <select
                  className="pf-input"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="pf-field">
                <label>Age</label>
                <input
                  type="number"
                  className="pf-input"
                  name="age"
                  value={form.age}
                  onChange={handleChange}
                />
              </div>

              <div className="pf-field">
                <label>Weight (kg)</label>
                <input
                  type="number"
                  className="pf-input"
                  name="weight"
                  value={form.weight}
                  onChange={handleChange}
                />
              </div>

              <div className="pf-field">
                <label>Height (cm)</label>
                <input
                  type="number"
                  className="pf-input"
                  name="height"
                  value={form.height}
                  onChange={handleChange}
                />
              </div>

              <div className="pf-field pf-wide">
                <label>Medical Conditions</label>
                <textarea
                  className="pf-input pf-textarea"
                  name="conditions"
                  value={form.conditions}
                  onChange={handleChange}
                />
              </div>

              <div className="pf-field pf-wide">
                <label>Allergies</label>
                <textarea
                  className="pf-input pf-textarea"
                  name="allergies"
                  value={form.allergies}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button className="pf-save-btn" onClick={saveChanges}>
              Save Changes
            </button>
          </div>
          <div>
            <div className="card profile-card profile-stats-card">
              <h3>Medication Statistics</h3>

              <div className="stat-chip">
                <p className="stat-label">Medication Accuracy</p>
                <p className="stat-value">No data yet</p>
              </div>

              <div className="profile-stats-row">
                <div className="stat-chip">
                  <p className="stat-label">Total Medications</p>
                  <p className="stat-value">0</p>
                </div>

                <div className="stat-chip">
                  <p className="stat-label">Active Doses</p>
                  <p className="stat-value">0</p>
                </div>

                <div className="stat-chip">
                  <p className="stat-label">Missed This Week</p>
                  <p className="stat-value">0</p>
                </div>
              </div>
            </div>
            <div className="card profile-card profile-settings-card">
              <h3>Account Settings</h3>
              <div className="setting-row">
                <div>
                  <p className="setting-title">Theme</p>
                  <p className="setting-sub">Switch between light and dark.</p>
                </div>

                <div className="theme-toggle-inline">
                  <button
                    className={theme === "light" ? "active-theme" : ""}
                    onClick={() => onThemeSwitch("light")}
                  >
                    Light
                  </button>

                  <button
                    className={theme === "dark" ? "active-theme" : ""}
                    onClick={() => onThemeSwitch("dark")}
                  >
                    Dark
                  </button>
                </div>
              </div>
              <div className="setting-row">
                <div>
                  <p className="setting-title">Notifications</p>
                  <p className="setting-sub">
                    Enable reminders and missed-dose alerts.
                  </p>
                </div>

                <button className="toggle-btn off">Off</button>
              </div>
=
              <div className="setting-row">
                <div>
                  <p className="setting-title danger">Delete Account</p>
                  <p className="setting-sub">
                    This clears your local data from this browser.
                  </p>
                </div>

                <button className="delete-btn">Delete</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
