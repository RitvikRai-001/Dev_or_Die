import { useState } from "react";
import "../styles/manage.css";
import Toast from "./Toast";
import { apiCreateCapsule } from "../services/api";

// Time Warning Modal Component
function TimeWarningModal({ pastTimes, onConfirm, onCancel }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content time-warning-modal">
        <div className="modal-header warning">
          <span className="warning-icon">⚠️</span>
          <h3>Time Already Passed</h3>
        </div>
        
        <p className="modal-description">
          The following dose time(s) have already passed today:
        </p>
        
        <div className="past-times-list">
          {pastTimes.map((time, idx) => (
            <div key={idx} className="past-time-item">
              🕐 {time}
            </div>
          ))}
        </div>

        <p className="modal-info">
          These doses will be marked as <strong>missed</strong> for today. 
          Would you like to continue or adjust the times?
        </p>

        <div className="modal-actions">
          <button onClick={onCancel} className="btn-secondary">
            Adjust Times
          </button>
          <button onClick={onConfirm} className="btn-primary">
            Continue Anyway
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ManageMedicines({
  onAddMedication,
  onCapsulesUpdated,
}) {
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState(1);
  const [times, setTimes] = useState(["08:00"]);
  const [duration, setDuration] = useState(3);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [pastTimes, setPastTimes] = useState([]);

  const changeFrequency = (e) => {
    const f = Number(e.target.value);
    setFrequency(f);

    setTimes((prev) => {
      let updated = [...prev];
      while (updated.length < f) updated.push("08:00");
      updated.length = f;
      return updated;
    });
  };

  // Helper function to check if times have passed
  const checkPastTimes = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    
    const passed = times.filter(time => {
      const [hour, minute] = time.split(":").map(Number);
      return hour < currentHour || (hour === currentHour && minute <= currentMinute);
    });

    return passed;
  };

  // Function to actually submit the capsule
  const submitCapsule = async () => {
    const payload = {
      name: name.trim(),
      frequency,
      timesOfDay: times,
      duration,
    };

    const res = await apiCreateCapsule(payload);

    if (!res.success) {
      setError(res.message || "Something went wrong");
      setShowWarningModal(false);
      return;
    }

    setToast(`Medication "${name}" added!`);

    if (onAddMedication) {
      onAddMedication(res.capsule);
    }

    if (onCapsulesUpdated) {
      onCapsulesUpdated();
    }

    // Reset form
    setName("");
    setFrequency(1);
    setTimes(["08:00"]);
    setDuration(3);
    setShowWarningModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Medication name is required.");
      return;
    }

    // Check for past times
    const passed = checkPastTimes();
    
    if (passed.length > 0) {
      // Show warning modal
      setPastTimes(passed);
      setShowWarningModal(true);
    } else {
      // All times are in the future, proceed directly
      await submitCapsule();
    }
  };

  return (
    <div className="card manage-card">
      <h3 className="card-title">Manage Medicines</h3>

      <form className="manage-form" onSubmit={handleSubmit}>
        <label>Medication Name</label>
        <input
          className="input-field"
          placeholder="e.g., Paracetamol 500mg"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <label>Frequency</label>
        <select
          className="input-field"
          value={frequency}
          onChange={changeFrequency}
        >
          <option value={1}>Once a day</option>
          <option value={2}>Twice a day</option>
          <option value={3}>3 times a day</option>
          <option value={4}>4 times a day</option>
        </select>

        <div className="time-grid">
          {times.map((t, idx) => (
            <div key={idx}>
              <label>Time {idx + 1}</label>
              <input
                type="time"
                className="input-field"
                value={t}
                onChange={(e) =>
                  setTimes((prev) => {
                    const arr = [...prev];
                    arr[idx] = e.target.value;
                    return arr;
                  })
                }
              />
            </div>
          ))}
        </div>

        <label>Duration (days)</label>
        <input
          type="number"
          min={1}
          className="input-field"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
        />

        {error && <p className="error-text">{error}</p>}
        <button className="primary-btn" type="submit">
          Save Medication
        </button>
      </form>

      {showWarningModal && (
        <TimeWarningModal
          pastTimes={pastTimes}
          onConfirm={submitCapsule}
          onCancel={() => setShowWarningModal(false)}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
