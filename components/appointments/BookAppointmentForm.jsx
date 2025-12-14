// src/components/appointments/BookAppointmentForm.jsx
import React, { useState } from "react"; // optional: generate unique ids, if you don't want this remove and use Date.now()
import "../../styles/components/BookAppointmentForm.css";

/**
 * BookAppointmentForm
 * Props:
 * - user: {id, name}
 * - preselectedDoctor: doctor object or null
 * - onClose(): called when modal closed
 * - onCreate(appointment): called with created appointment object
 *
 * Note: If you don't have uuid installed, you can replace uuidv4() with Date.now()
 */
export default function BookAppointmentForm({ user, preselectedDoctor, onClose, onCreate }) {
  // fallback: if user not passed, take from localStorage
  const [doctor, setDoctor] = useState(preselectedDoctor || { id: "", name: "", specialty: "" });
  const [date, setDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(10, 0, 0, 0);
    return d.toISOString().slice(0, 16); // yyyy-MM-ddTHH:mm
  });
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    // create appointment object (mock)
    const appointment = {
      id: uuidv4 ? uuidv4() : Date.now().toString(),
      user: user,
      doctor: doctor,
      date: new Date(date).toISOString(),
      reason: reason || "General Consultation",
      createdAt: new Date().toISOString(),
    };

    // simulate small network delay
    setTimeout(() => {
      onCreate(appointment);
      setLoading(false);
    }, 400);
  }

  // if we were given a doctor object, display it read-only; otherwise let user choose from small list
  const extraDoctors = [
    { id: "d1", name: "Dr. Aisha Roy", specialty: "General Physician" },
    { id: "d2", name: "Dr. Rohit Mehra", specialty: "Cardiologist" },
    { id: "d3", name: "Dr. S. Kapoor", specialty: "Pediatrics" },
    { id: "d4", name: "Dr. Meena Iyer", specialty: "Dermatologist" },
  ];

  return (
    <div className="modal-overlay" role="dialog" aria-modal="true">
      <div className="modal-card">
        <header className="modal-header">
          <h3>Book Appointment</h3>
          <button className="x-btn" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </header>

        <form className="book-form" onSubmit={handleSubmit}>
          <label className="label">
            Patient
            <input type="text" value={user?.name || "Guest"} readOnly />
          </label>

          <label className="label">
            Doctor
            {preselectedDoctor ? (
              <input value={`${preselectedDoctor.name} — ${preselectedDoctor.specialty}`} readOnly />
            ) : (
              <select
                value={doctor.id}
                onChange={(e) => {
                  const d = extraDoctors.find((x) => x.id === e.target.value) || { id: "", name: "", specialty: "" };
                  setDoctor(d);
                }}
              >
                <option value="">Choose doctor</option>
                {extraDoctors.map((d) => (
                  <option value={d.id} key={d.id}>
                    {d.name} — {d.specialty}
                  </option>
                ))}
              </select>
            )}
          </label>

          <label className="label">
            Date & Time
            <input
              type="datetime-local"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          <label className="label">
            Reason
            <input
              type="text"
              placeholder="Brief reason (e.g., checkup, cough)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </label>

          <div className="modal-actions">
            <button type="button" className="outline-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="med-btn" disabled={loading || !doctor?.id && !preselectedDoctor}>
              {loading ? "Booking..." : "Confirm Booking"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
