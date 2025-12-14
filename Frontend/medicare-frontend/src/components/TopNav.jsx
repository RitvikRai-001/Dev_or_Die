import { useState, useEffect, useRef } from "react";
import "../styles/topnav.css";
import { useNavigate } from "react-router-dom";
import {
  apiLogout,
  apiMarkNotificationRead,
  apiMarkAllNotificationsRead,
} from "../services/api";

export default function TopNav({
  username,
  notifications,
  onAddMedicationClick,
  onThemeSwitch,
  schedule = [],
  onNotificationsRead, // 🔹 callback from Home to refresh notifications
}) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navigate = useNavigate();
  const notifRef = useRef(null);

  // 🔹 NEW: calculate unread notifications count
  // WHY: badge should show unread count, not total
  const unreadCount =
    notifications?.filter((n) => !n.isRead).length || 0;

  // 🔹 NEW: close notification dropdown when clicking outside
  // WHY: better UX
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🔹 NEW: mark single notification as read
  // WHY: backend supports isRead, we must update it
  const handleNotificationClick = async (notificationId) => {
    try {
      await apiMarkNotificationRead(notificationId);
      onNotificationsRead?.(); // refresh in Home.jsx
    } catch (err) {
      console.error("Error marking notification read:", err);
    }
  };

  // 🔹 NEW: mark all notifications as read
  const handleMarkAllRead = async () => {
    try {
      await apiMarkAllNotificationsRead();
      onNotificationsRead?.();
    } catch (err) {
      console.error("Error marking all read:", err);
    }
  };

  const handleSignOut = async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      localStorage.clear();
      navigate("/", { replace: true });
    }
  };

  const handleProfileClick = () => {
    navigate("/profile", { state: { schedule } });
    setProfileOpen(false);
  };

  return (
    <nav className="topnav">
      <div className="nav-left">
        <span className="logo">🧬 RangerHealth</span>
      </div>

      <div className="nav-center">
        <button className="nav-item active" onClick={() => navigate("/Home")}>
          Home
        </button>
        <button className="nav-item">About Us</button>
        <button className="nav-item">Contact</button>
        <button className="nav-item">Help</button>

        <button
          className="nav-item med-button"
          onClick={onAddMedicationClick}
        >
          💊 Add Medication
        </button>
      </div>

      <div className="nav-right">
        {/* 🔹 NOTIFICATION SECTION */}
        <div className="notif-wrapper" ref={notifRef}>
          <button
            className="notif-btn"
            onClick={() => {
              setNotifOpen((p) => !p);
              setProfileOpen(false);
            }}
          >
            🔔
            {/* 🔹 show unread count only */}
            {unreadCount > 0 && (
              <span className="notif-count">{unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="notif-dropdown">
              {/* 🔹 FIX 1: Added header with "Notifications" title and "Mark all as read" button */}
              {/* WHY: Gives context to the dropdown and shows action button when there are unread notifications */}
              {notifications && notifications.length > 0 && (
                <div className="notif-header">
                  <span>Notifications</span> {/* ✅ ADDED: Title text */}
                  {unreadCount > 0 && (
                    <button
                      className="mark-all-read"
                      onClick={handleMarkAllRead}
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
              )}

              {!notifications || notifications.length === 0 ? (
                <p className="notif-empty">No alerts right now.</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`notif-item ${n.type} ${n.isRead ? "read" : "unread"}`} /* ✅ ADDED: n.type for color-coded borders */
                    onClick={() => handleNotificationClick(n._id)}
                  >
                    <strong>{n.title}</strong>
                    <p>{n.message}</p>
                    {/* 🔹 FIX 2: Added timestamp display */}
                    {/* WHY: Users need to know when notification was created */}
                    <span className="notif-time">
                      {new Date(n.createdAt).toLocaleString()} {/* ✅ ADDED: Formatted timestamp */}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 🔹 PROFILE SECTION */}
        <div className="profile-wrapper">
          <button
            className="profile-btn"
            onClick={() => {
              setProfileOpen((p) => !p);
              setNotifOpen(false);
            }}
          >
            <span className="avatar">
              {username?.charAt(0).toUpperCase()}
            </span>
            <span className="username">{username}</span>
          </button>

          {profileOpen && (
            <div className="profile-dropdown">
              <button
                className="profile-item"
                onClick={handleProfileClick}
              >
                Profile
              </button>

              <button className="profile-item">
                Theme
                <div className="theme-options">
                  <button onClick={() => onThemeSwitch("light")}>
                    Light
                  </button>
                  <button onClick={() => onThemeSwitch("dark")}>
                    Dark
                  </button>
                </div>
              </button>

              <button
                className="profile-item"
                onClick={handleSignOut}
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
