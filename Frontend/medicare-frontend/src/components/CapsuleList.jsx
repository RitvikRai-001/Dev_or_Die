import "../styles/capsules.css";

export default function CapsuleList({ doses, onMarkTaken }) {
  const now = new Date();

  const upcoming = doses
    .filter((d) => d.status === "pending")
    .filter((d) => {
      const dt = new Date(`${d.date}T${d.time}:00`);
      return dt >= now;
    })
    .sort((a, b) => {
      const da = new Date(`${a.date}T${a.time}:00`);
      const db = new Date(`${b.date}T${b.time}:00`);
      return da - db;
    })
    .slice(0, 3);

  return (
    <div className="card capsules-card">
      <h3 className="card-title">Upcoming Medications</h3>

      {upcoming.length === 0 && (
        <p className="no-med">No upcoming medications scheduled.</p>
      )}

      {upcoming.map((dose) => (
        <div key={dose.id} className={`capsule-item ${dose.status}`}>
          <div className="capsule-info">
            <p className="capsule-name">{dose.name}</p>
            <span className="capsule-time">
              {dose.date} — {dose.time}
            </span>
          </div>

          <div className="capsule-status-box">
            <span className={`capsule-status ${dose.status}`}>
              {dose.status}
            </span>

            {dose.status === "pending" && (
              <button
                className="take-btn"
                onClick={() => onMarkTaken(dose.id)}
              >
                Mark Taken
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
