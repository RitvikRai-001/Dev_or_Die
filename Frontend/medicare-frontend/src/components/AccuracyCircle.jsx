import "../styles/accuracy.css";

export default function AccuracyCircle({ doses }) {
  if (!doses || doses.length === 0) {
    return (
      <div className="card accuracy-card">
        <h3 className="card-title">Medication Accuracy</h3>
        <p className="accuracy-empty">No data yet.</p>
      </div>
    );
  }

  const total = doses.length;
  const taken = doses.filter((d) => d.status === "done").length;
  const overallAcc = Math.round((taken / total) * 100);

  const dayStats = {};
  doses.forEach((d) => {
    const key = d.date;
    if (!dayStats[key]) {
      dayStats[key] = { total: 0, taken: 0 };
    }
    dayStats[key].total += 1;
    if (d.status === "done") {
      dayStats[key].taken += 1;
    }
  });

  const today = new Date();
  const dateKey = (dt) => {
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  let weeklyTotal = 0;
  let weeklyTaken = 0;
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    const key = dateKey(d);
    const stats = dayStats[key];
    if (stats) {
      weeklyTotal += stats.total;
      weeklyTaken += stats.taken;
    }
  }
  const weeklyAcc =
    weeklyTotal > 0 ? Math.round((weeklyTaken / weeklyTotal) * 100) : null;

  const sortedDates = Object.keys(dayStats).sort();

  let bestStreak = 0;
  let cur = 0;
  for (const key of sortedDates) {
    const stats = dayStats[key];
    if (stats.total > 0 && stats.taken === stats.total) {
      cur += 1;
      if (cur > bestStreak) bestStreak = cur;
    } else if (stats.total > 0) {
      cur = 0;
    }
  }

  const sortedDesc = [...sortedDates].sort().reverse();
  let currentStreak = 0;
  for (const key of sortedDesc) {
    const d = new Date(key);
    if (d > today) continue;
    const stats = dayStats[key];
    if (!stats || stats.total === 0) continue;
    if (stats.taken === stats.total) {
      currentStreak += 1;
    } else {
      break;
    }
  }

  const greenDeg = (overallAcc / 100) * 360;

  return (
    <div className="card accuracy-card">
      <h3 className="card-title">Medication Accuracy</h3>

      <div
        className="accuracy-circle"
        style={{
          background: `conic-gradient(
            var(--success) ${greenDeg}deg,
            var(--danger) ${greenDeg}deg
          )`,
        }}
      >
        <div className="accuracy-inner">
          <span className="accuracy-value">{overallAcc}%</span>
        </div>
      </div>

      <p className="accuracy-sub">
        {taken} taken / {total} doses
      </p>

      <div className="accuracy-meta">
        <p>
          <strong>Last 7 days:</strong>{" "}
          {weeklyAcc !== null ? `${weeklyAcc}%` : "No data"}
        </p>
        <p>
          <strong>Current streak:</strong> {currentStreak} day
          {currentStreak === 1 ? "" : "s"}
        </p>
        <p>
          <strong>Best streak:</strong> {bestStreak} day
          {bestStreak === 1 ? "" : "s"}
        </p>
      </div>
    </div>
  );
}
