import { useState } from "react";
import "../styles/topnav.css";
import { useNavigate } from "react-router-dom";


export default function TopNav({
  username,
  notifications,
  onAddMedicationClick,
  onThemeSwitch,
  schedule = [],
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem("username");
    navigate("/"); 
  };

  const handleProfileClick = () => {
    navigate("/profile", { state: { schedule } });
    setProfileOpen(false);
  };

  const goHome = () => {
    navigate("/Home");
  };

  return (
    <nav className="topnav">
      <div className="nav-left">
        <span className="logo">🧬 RangerHealth</span>
      </div>
      <div className="nav-center">
        <button className="nav-item active" onClick={goHome}>
          Home
        </button>
        <button className="nav-item">About Us</button>
        <button className="nav-item">Contact</button>
        <button className="nav-item">Help</button>

        <button className="nav-item med-button" onClick={onAddMedicationClick}>
          💊 Add Medication
        </button>
      </div>
      <div className="nav-right">
        <div className="notif-wrapper">
          <button
            className="notif-btn"
            onClick={() => {
              setNotifOpen((prev) => !prev);
              setProfileOpen(false);
            }}
          >
            🔔
            {notifications && notifications.length > 0 && (
              <span className="notif-count">{notifications.length}</span>
            )}
          </button>

          {notifOpen && (
            <div className="notif-dropdown">
              {!notifications || notifications.length === 0 ? (
                <p className="notif-empty">No alerts right now.</p>
              ) : (
                notifications.map((n, i) => (
                  <p key={i} className={`notif-item ${n.type}`}>
                    {n.message}
                  </p>
                ))
              )}
            </div>
          )}
        </div>
        <div className="profile-wrapper">
          <button
            className="profile-btn"
            onClick={() => {
              setProfileOpen((prev) => !prev);
              setNotifOpen(false);
            }}
          >
            <span className="avatar">
              {username ? username.charAt(0).toUpperCase() : "U"}
            </span>
            <span className="username">{username}</span>
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
