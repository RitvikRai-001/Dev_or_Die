import "../styles/doctor-home.css";

export default function DoctorStatCard({ title, value, sub, icon }) {
  return (
    <div className="card doctor-stat-card">
      <div className="stat-icon">{icon}</div>

      <div className="stat-info">
        <p className="stat-title">{title}</p>
        <p className="stat-value">{value}</p>
        {sub && <p className="stat-sub">{sub}</p>}
      </div>
    </div>
  );
}
