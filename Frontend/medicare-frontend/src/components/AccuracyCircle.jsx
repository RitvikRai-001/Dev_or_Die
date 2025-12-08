import "../styles/accuracy.css";
import { useEffect, useState } from "react";
import { apiGetAdherence } from "../services/api"; 

export default function AccuracyCircle() {
  const [stats, setStats] = useState(null);

  
  useEffect(() => {
    async function loadStats() {
      const res = await apiGetAdherence(30); // fetch 30-day adherence
      if (res.success) {
        setStats(res.data); 
      }
    }
    loadStats();
  }, []);

 
  if (!stats) {
    return (
      <div className="card accuracy-card">
        <h3 className="card-title">Medication Accuracy</h3>
        <p className="accuracy-empty">Loading...</p>
      </div>
    );
  }

  const { adherencePercentage, takenCount, totalDoses } = stats;

  const greenDeg = (adherencePercentage / 100) * 360;

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
          <span className="accuracy-value">{adherencePercentage}%</span>
        </div>
      </div>

      
      <p className="accuracy-sub">
        {takenCount} taken / {totalDoses} doses
      </p>

      
    </div>
  );
}
