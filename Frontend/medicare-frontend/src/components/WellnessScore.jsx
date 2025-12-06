import "../styles/wellness.css";
import { useState, useEffect } from "react";

export default function WellnessScore() {
  const [score, setScore] = useState(null);

  useEffect(() => {
    setScore(82);
  }, []);

  return (
    <div className="card wellness-card">
      <h3 className="card-title">Wellness Score</h3>

      <div className="wellness-ring">
        <div className="inner-ring">
          <p className="score-value">{score ?? "--"}</p>
          <span className="score-max">/100</span>
        </div>
      </div>

      <div className="insight-box">
        <strong>AI Insight:</strong> Your sleep improved this week!
      </div>

      <button className="outline-btn">View Full AI Insights →</button>
    </div>
  );
}
