import { useState } from "react";
import "../styles/manage.css";
import Toast from "./Toast";

export default function ManageMedicines({ onAddMedication }) {
  const [name, setName] = useState("");
  const [frequency, setFrequency] = useState(1);
  const [times, setTimes] = useState(["08:00"]);
  const [duration, setDuration] = useState(3);
  const [toast, setToast] = useState("");

  function generateSchedule(times, duration) {
    const schedule = [];
    const now = new Date();

    for (let day = 0; day < duration; day++) {
      times.forEach((t) => {
        const [hour, minute] = t.split(":").map(Number);

        let doseTime = new Date();
        doseTime.setHours(hour, minute, 0, 0);
        doseTime.setDate(doseTime.getDate() + day);
        if (day === 0 && doseTime < now) {
          doseTime.setDate(doseTime.getDate() + 1);
        }

        schedule.push({
          time: doseTime.toISOString(),
          status: "pending",
          medName: name.trim(),
        });
      });
    }

    return schedule;
  }

  const changeFrequency = (e) => {
    const f = Number(e.target.value);
    setFrequency(f);

    setTimes((prev) => {
      const updated = [...prev];
      while (updated.length < f) updated.push("08:00");
      updated.length = f;
      return updated;
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    const schedule = generateSchedule(times, duration);

    onAddMedication({
      name: name.trim(),
      times,
      duration,
      schedule,
    });

    setName("");
    setFrequency(1);
    setTimes(["08:00"]);
    setDuration(3);

    setToast(`Medication "${name.trim()}" added for ${duration} day(s).`);
  };

  return (
    <div className="card manage-card">
      <h3 className="card-title">Manage Medicines</h3>

      <form className="manage-form" onSubmit={handleSubmit}>
        <label>Medication Name</label>
        <div className="med-search-wrapper">
          <input
            className="input-field med-search-input"
            placeholder="e.g., Paracetamol 500mg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

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
            <div key={idx} className="time-row">
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

        <button className="primary-btn" type="submit">
          Save Medication
        </button>
      </form>

      {toast && <Toast message={toast} onClose={() => setToast("")} />}
    </div>
  );
}
