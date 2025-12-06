import React, { useState, useEffect } from "react";
import "../styles/profile.css";
import TopNav from "../components/TopNav";
import { apiGetCurrentUser,apiUpdateProfile } from "../services/api";

export default function Profile({ theme, onThemeSwitch }) {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    gender: "",
    age: "",
    weight: "",
    height: "",
    conditions: "",
    allergies: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false); 

  useEffect(() => {
  async function loadUser() {
    try {
      setLoading(true);
      const res = await apiGetCurrentUser();

      if (!res.success || !res.user) {
        throw new Error(res.message || "Failed to load profile");
      }

      const u = res.user;
      setUser(u);

      let gender = "";
      if (typeof u.gender === "string") {
        const lower = u.gender.toLowerCase();
        if (lower === "male" || lower === "m") gender = "Male";
        else if (lower === "female" || lower === "f") gender = "Female";
        else if (lower === "other") gender = "Other";
      }

      setForm((prev) => ({
        ...prev,
        gender,
        age: u.age || "",
        weight: u.weight || "",          
        height: u.height || "",          
        conditions: u.conditions || "",  
        allergies: u.allergies || "",    
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  loadUser();
}, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

    const saveChanges = async () => {
    try {
      setSaving(true);
      setError("");

      const payload = {
        weight: form.weight ? Number(form.weight) : undefined,
        height: form.height ? Number(form.height) : undefined,
        conditions: form.conditions || "",
        allergies: form.allergies || "",
       
      };

      const res = await apiUpdateProfile(payload);

      if (!res.success) {
        throw new Error(res.message || "Failed to update profile");
      }

     
      const updated = res.user;
    setUser(updated);
    setForm((prev) => ({
      ...prev,
      weight: updated.weight || "",
      height: updated.height || "",
      conditions: updated.conditions || "",
      allergies: updated.allergies || "",
    }));

    alert("Profile updated!");
  } catch (err) {
    setError(err.message);
  } finally {
    setSaving(false);
  }
};



  if (loading) return <div className="profile-page">Loading profile...</div>;
  if (error) return (
    <div className="profile-page" style={{ color: "red" }}>
      {error}
    </div>
  );
  if (!user) return <div className="profile-page">No user data</div>;

  const displayName = user.fullname || user.username || "User";
  const email = user.email || "example@mail.com";
  const joined = user.createdAt
    ? new Date(user.createdAt).toLocaleString("default", {
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="profile-page">
      <TopNav username={displayName} onThemeSwitch={onThemeSwitch} />

      <div className="profile-content">
        {/* Top identity card */}
        <div className="card profile-card">
          <div className="profile-identity-card">
            <div className="profile-avatar">
              {displayName.charAt(0).toUpperCase()}
            </div>

            <div className="profile-main-info">
              <p className="profile-name">{displayName}</p>
              <p className="profile-email">{email}</p>
              <p className="profile-joined">Joined: {joined}</p>
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
                <input className="pf-input" value={displayName} disabled />
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
                  disabled={true}
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
                  disabled={true}
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

          <button className="pf-save-btn" onClick={saveChanges} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
          </button>

          </div>

          {/* Right side: stats + settings */}
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
                  <p className="setting-sub">
                    Switch between light and dark.
                  </p>
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
