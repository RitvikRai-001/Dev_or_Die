import { useState } from "react";
import "../styles/topnav.css";
import { useNavigate } from "react-router-dom";

export default function DoctorTopNav({
  username,
  notifications,
  onAddPatientClick,
  onThemeSwitch,
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();

  const goHome = () => navigate("/doctor-home");

  const handleProfileClick = () => {
    navigate("/profile");
    setProfileOpen(false);
  };

  const handleSignOut = () => {
    localStorage.removeItem("username");
    navigate("/");
  };

  // Initials for responsive mode
  const initials = username
    ? username
        .split(" ")
        .map((n) => n[0].toUpperCase())
        .join("")
    : "U";

  return (
    <nav className="topnav">
      {/* LEFT */}
      <div className="nav-left">
        <span className="logo">🧬 RangerHealth</span>
      </div>

      {/* CENTER */}
      <div className="nav-center">
        <button className="nav-item active" onClick={goHome}>
          Home
        </button>
        <button className="nav-item">About</button>
        <button className="nav-item">Contact</button>

        <button className="nav-item med-button" onClick={onAddPatientClick}>
          ➕ Add Patient
        </button>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        {/* NOTIFICATIONS */}
        <div className="notif-wrapper">
          <button
            className="notif-btn"
            onClick={() => {
              setNotifOpen((p) => !p);
              setProfileOpen(false);
            }}
          >
            🔔
            {notifications?.length > 0 && (
              <span className="notif-count">{notifications.length}</span>
            )}
          </button>

          {notifOpen && (
            <div className="notif-dropdown">
              {(!notifications || notifications.length === 0) && (
                <p className="notif-empty">No alerts right now.</p>
              )}

              {notifications?.map((n, i) => (
                <p key={i} className={`notif-item ${n.type}`}>
                  {n.message}
                </p>
              ))}
            </div>
          )}
        </div>

        {/* PROFILE */}
        <div className="profile-wrapper">
          <button
            className="profile-btn"
            onClick={() => {
              setProfileOpen((p) => !p);
              setNotifOpen(false);
            }}
          >
            <span className="avatar">{initials.charAt(0)}</span>
            <span className="username full-name">{username}</span>
            <span className="username short-name">{initials}</span>
          </button>

          {profileOpen && (
            <div className="profile-dropdown">
              <button className="profile-item" onClick={handleProfileClick}>
                Profile
              </button>

              <button className="profile-item">
                Theme
                <div className="theme-options">
                  <button onClick={() => onThemeSwitch("light")}>Light</button>
                  <button onClick={() => onThemeSwitch("dark")}>Dark</button>
                </div>
              </button>

              <button className="profile-item" onClick={handleSignOut}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
