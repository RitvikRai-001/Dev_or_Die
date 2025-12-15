import "../styles/capsules.css";

// ================================================================
// CAPSULE LIST COMPONENT - Displays Upcoming Medications
// ================================================================
// PURPOSE: Shows next 3 upcoming scheduled doses
// DISPLAYS: Medicine name, date, time, and "Mark Taken" button
// ================================================================

export default function CapsuleList({ doses = [], onMarkTaken }) {
  const now = new Date();

  // ================================================================
  // ✅ CRITICAL FIX: Use scheduledTime directly from backend
  // ================================================================
  // PROBLEM: Date reconstruction from separate date/time strings
  // OLD CODE: new Date(`${d.date}T${d.time}:00`)
  //   - d.date format: "2025-12-15"
  //   - d.time format: "08:00"
  //   - Reconstructs: new Date("2025-12-15T08:00:00")
  //   - ISSUES: 
  //     * Timezone conversion problems
  //     * String parsing inconsistencies
  //     * Fails for capsules created at night (2 AM)
  //
  // NEW CODE: new Date(d.scheduledTime)
  //   - scheduledTime comes directly from MongoDB as ISO string
  //   - Already in correct timezone
  //   - More reliable, no reconstruction needed
  //
  // WHY THIS FIXES THE BUG:
  // - Capsules created at 2 AM with 8:00 AM dose now show correctly
  // - No timezone conversion issues
  // - Direct use of backend's timestamp
  // ================================================================
  
  const upcoming = doses
    .filter((d) => d.status === "scheduled")
    .filter((d) => {
      // ✅ FIXED: Use scheduledTime directly from backend
      // BEFORE: const dt = new Date(`${d.date}T${d.time}:00`);
      // AFTER: const dt = new Date(d.scheduledTime);
      const dt = new Date(d.scheduledTime);
      return dt >= now;
    })
    .sort((a, b) => {
      // ✅ FIXED: Use scheduledTime for sorting
      // BEFORE: const da = new Date(`${a.date}T${a.time}:00`);
      // AFTER: const da = new Date(a.scheduledTime);
      const da = new Date(a.scheduledTime);
      const db = new Date(b.scheduledTime);
      return da - db;
    })
    .slice(0, 3); // Show only first 3 upcoming doses

  return (
    <div className="card capsules-card">
      <h3 className="card-title">Upcoming Medications</h3>

      {/* Empty state */}
      {upcoming.length === 0 && (
        <p className="no-med">No upcoming medications scheduled.</p>
      )}

      {/* Render upcoming doses */}
      {upcoming.map((dose, index) => (
        <div key={index} className={`capsule-item ${dose.status}`}>
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

            {/* ================================================================
                MARK TAKEN BUTTON
                ================================================================
                SECURITY: Only show for scheduled doses with valid capsuleId
                ================================================================
                ✅ FIXED: Pass scheduledTime directly
                ================================================================
                BEFORE: scheduledTime: `${dose.date}T${dose.time}:00`
                AFTER: scheduledTime: dose.scheduledTime
                
                WHY THIS MATTERS:
                - Backend expects ISO string format
                - dose.scheduledTime is already in correct format
                - No need to reconstruct from date/time strings
                - Consistent with backend's stored value
                ================================================================ */}
            {dose.status === "scheduled" && dose.capsuleId && (
              <button
                className="take-btn"
                onClick={() =>
                  onMarkTaken({
                    capsuleId: dose.capsuleId,
                    scheduledTime: dose.scheduledTime, // ✅ FIXED: Use scheduledTime directly
                  })
                }
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
