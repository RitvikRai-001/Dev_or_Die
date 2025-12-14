import "../styles/header.css";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour >= 17 || hour < 4) return "Good Evening";
  if (hour >= 4 && hour < 12) return "Good Morning";
  return "Good Afternoon";
}

export default function DoctorDashboardHeader({ username }) {
  const greeting = getGreeting();

  // Extract last name → fallback to username
  const parts = username.trim().split(" ");
  const lastName = parts.length > 1 ? parts[parts.length - 1] : username;

  return (
    <header className="dashboard-header">
      <p className="header-label">DOCTOR DASHBOARD</p>

      <h1 className="header-title">
        {greeting}, Dr. {lastName}
        <span className="wave">👋</span>
      </h1>

      <p className="header-subtitle">
        Manage appointments and patient records efficiently.
      </p>
    </header>
  );
}
