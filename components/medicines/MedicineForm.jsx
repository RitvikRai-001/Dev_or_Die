// src/components/medicines/MedicineForm.jsx
import React, { useState } from "react";

export default function MedicineForm({ onClose, onSave }) {
  const today = new Date().toISOString().slice(0, 10);

  const [form, setForm] = useState({
    name: "",
    dosage: "",
    frequencyPerDay: 1,
    startDate: today,
    endDate: today,
    notes: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    onSave(form);
  }

  return (
    <div className="med-modal-overlay">
      <div className="med-modal">
        <header className="med-modal-header">
          <h3>Add Medicine</h3>
          <button className="x-btn" onClick={onClose}>
            ✕
          </button>
        </header>

        <form className="med-form" onSubmit={handleSubmit}>
          <label className="med-label">
            Medicine Name
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g., Paracetamol"
              required
            />
          </label>

          <label className="med-label">
            Dosage
            <input
              name="dosage"
              value={form.dosage}
              onChange={handleChange}
              placeholder="e.g., 500 mg"
            />
          </label>

          <label className="med-label">
            Doses per day
            <input
              type="number"
              min="1"
              max="10"
              name="frequencyPerDay"
              value={form.frequencyPerDay}
              onChange={handleChange}
            />
          </label>

          <label className="med-label">
            Start date
            <input
              type="date"
              name="startDate"
              value={form.startDate}
              onChange={handleChange}
            />
          </label>

          <label className="med-label">
            End date
            <input
              type="date"
              name="endDate"
              value={form.endDate}
              onChange={handleChange}
            />
          </label>

          <label className="med-label med-notes">
            Notes
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Timing, with food, etc."
            />
          </label>

          <div className="med-modal-actions">
            <button type="button" className="outline-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="med-btn">
              Save Medicine
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
