import { useState } from "react";
import "../styles/calendar.css";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function CalendarWidget({ doses }) {
  const [hoverInfo, setHoverInfo] = useState(null);

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const events = {};
  doses.forEach((d) => {
    const key = d.date;
    if (!events[key]) events[key] = [];
    events[key].push(d);
  });

  const showTooltip = (e, items) => {
    const rect = e.target.getBoundingClientRect();
    setHoverInfo({
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
      items,
    });
  };

  return (
    <div className="card calendar-card">
      <h3 className="card-title">Medication Calendar</h3>

      <div className="weekday-row">
        {WEEKDAYS.map((w) => (
          <div key={w} className="weekday-cell">
            {w}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {Array.from({ length: daysInMonth }, (_, idx) => {
          const day = idx + 1;
          const dateStr = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(day).padStart(2, "0")}`;

          const meds = events[dateStr];
          const hasMed = !!meds;
          const hasDone = meds?.some((m) => m.status === "done");
          const hasMiss = meds?.some((m) => m.status === "missed");

          return (
            <div
              key={day}
              className={`cal-day ${hasMed ? "has-med" : ""} ${
                hasDone ? "done-day" : ""
              } ${hasMiss ? "miss-day" : ""}`}
              onMouseEnter={(e) => meds && showTooltip(e, meds)}
              onMouseLeave={() => setHoverInfo(null)}
            >
              {day}
            </div>
          );
        })}
      </div>

      {hoverInfo && (
        <div
          className="cal-tooltip"
          style={{ left: hoverInfo.x, top: hoverInfo.y }}
        >
          {hoverInfo.items.map((m, i) => (
            <p key={i}>
              <strong>{m.name}</strong> — {m.time} ({m.status})
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
