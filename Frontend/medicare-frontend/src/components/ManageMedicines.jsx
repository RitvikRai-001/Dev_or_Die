import { useState } from "react";
import "../styles/manage.css";
import Toast from "./Toast";
import { apiCreateCapsule } from "../services/api";

export default function ManageMedicines({
  onAddMedication,
  onCapsulesUpdated, // 👈 NEW PROP
}) {
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState(1);
  const [times, setTimes] = useState(["08:00"]);
  const [duration, setDuration] = useState(3);
  const [toast, setToast] = useState("");
  const [error, setError] = useState("");

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Medication name is required.");
      return;
    }

    const payload = {
      name: name.trim(),
      frequency,       // number (1–4)
      timesOfDay: times,
      duration,        // number of days
    };

    const res = await apiCreateCapsule(payload);

    if (!res.success) {
      setError(res.message || "Something went wrong");
      return;
    }

    setToast(`Medication "${name}" added!`);

    if (onAddMedication) {
      onAddMedication(res.capsule);
    }

    if (onCapsulesUpdated) {
      onCapsulesUpdated(); // 👈 TRIGGER REFRESH IN HOME
    }

    setName("");
    setFrequency(1);
    setTimes(["08:00"]);
    setDuration(3);
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

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
