// src/components/appointments/DoctorCard.jsx
import React from "react";
import SlotPicker from "./SlotPicker";
import "../../styles/components/DoctorCard.css";


export default function DoctorCard({ doctor, onBook = () => {} }) {
  // small local slots mock
  const exampleSlots = [
    { id: "s1", time: addMinutes(new Date(), 60) },
    { id: "s2", time: addMinutes(new Date(), 120) },
    { id: "s3", time: addMinutes(new Date(), 60 * 24) },
  ];

  function addMinutes(d, m) {
    return new Date(d.getTime() + m * 60000);
  }

  return (
    <div className="doctor-card">
      <div className="doc-left">
        <div className="avatar-circle">{doctor.name[0]}</div>
        <div className="doc-meta">
          <div className="doc-name">{doctor.name}</div>
          <div className="muted doc-spec">{doctor.specialty}</div>
        </div>
      </div>

      <div className="doc-right">
        <div className="doc-rating">⭐ {doctor.rating}</div>
        <button className="outline-btn" onClick={() => onBook(doctor)}>
          Book
        </button>
      </div>

      <div className="slot-row">
        <SlotPicker slots={exampleSlots} onSelect={(slot) => onBook(doctor)} />
      </div>
    </div>
  );
}
