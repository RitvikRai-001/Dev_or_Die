// src/components/medicines/MedicineCard.jsx
import React from "react";

export default function MedicineCard({
  medicine,
  isActive,
  onSelect,
  onDelete,
}) {
  const total = medicine.totalDoses || medicine.log.length || 0;
  const taken = medicine.log.filter((l) => l.status === "taken").length;
  const missed = medicine.log.filter((l) => l.status === "missed").length;
  const upcoming = medicine.log.filter((l) => l.status === "upcoming").length;

  return (
    <article
      className={`med-card ${isActive ? "active" : ""}`}
      onClick={onSelect}
    >
      <div className="med-card-main">
        <div>
          <div className="med-name">{medicine.name}</div>
          <div className="med-sub">
            {medicine.dosage} • {medicine.frequencyPerDay}x/day
          </div>
        </div>
        <button
          className="med-delete"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          ✕
        </button>
      </div>

      <div className="med-dates">
        <span>
          {new Date(medicine.startDate).toLocaleDateString()} →{" "}
          {new Date(medicine.endDate).toLocaleDateString()}
        </span>
      </div>

      <div className="med-stats-row">
        <span className="pill taken">Taken: {taken}</span>
        <span className="pill upcoming">Upcoming: {upcoming}</span>
        <span className="pill missed">Missed: {missed}</span>
      </div>

      {total > 0 && (
        <div className="progress-bar">
          <div
            className="progress-inner"
            style={{ width: `${Math.min((taken / total) * 100, 100)}%` }}
          />
        </div>
      )}
    </article>
  );
}
