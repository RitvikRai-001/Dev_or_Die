// src/components/medicines/MedicineLog.jsx
import React from "react";

const cycleStatus = (status) => {
  if (status === "upcoming") return "taken";
  if (status === "taken") return "missed";
  return "upcoming";
};

export default function MedicineLog({ medicine, onUpdateLog, onAddLog }) {
  const log = medicine.log || [];

  const taken = log.filter((l) => l.status === "taken");
  const missed = log.filter((l) => l.status === "missed");
  const upcoming = log.filter((l) => l.status === "upcoming");

  function handleToggle(logEntry) {
    const next = cycleStatus(logEntry.status);
    onUpdateLog(medicine.id, logEntry.id, next);
  }

  return (
    <div className="log-wrapper">
      <div className="log-header">
        <h3>Medicine Log</h3>
        <button
          className="outline-btn"
          onClick={() => onAddLog(medicine.id, "New dose")}
        >
          + Add dose entry
        </button>
      </div>

      {log.length === 0 && (
        <div className="empty-box">
          No entries yet. Use <b>Add dose entry</b> to start logging.
        </div>
      )}

      <div className="log-grid">
        <LogColumn
          title="Upcoming"
          items={upcoming}
          badgeClass="pill upcoming"
          onToggle={handleToggle}
        />
        <LogColumn
          title="Taken"
          items={taken}
          badgeClass="pill taken"
          onToggle={handleToggle}
        />
        <LogColumn
          title="Missed"
          items={missed}
          badgeClass="pill missed"
          onToggle={handleToggle}
        />
      </div>
      <p className="muted tiny">
        Tip: click a log item to cycle between <b>upcoming → taken → missed</b>.
      </p>
    </div>
  );
}

function LogColumn({ title, items, badgeClass, onToggle }) {
  return (
    <div className="log-col">
      <div className="log-col-header">
        <span>{title}</span>
        <span className={badgeClass}>{items.length}</span>
      </div>

      {items.length === 0 ? (
        <div className="log-empty">—</div>
      ) : (
        <ul className="log-list">
          {items.map((l) => (
            <li key={l.id} onClick={() => onToggle(l)}>
              <div className="log-label">{l.label}</div>
              <div className="log-time">
                {new Date(l.dateTime).toLocaleString()}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
