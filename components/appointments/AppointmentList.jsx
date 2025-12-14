// src/components/appointments/AppointmentList.jsx
import React from "react";
import DoctorCard from "./DoctorCard";
import "../../styles/components/AppointmentList.css";

/**
 * Simple list of doctors (mock). In a real app this would come from API.
 * Clicking "Book" will call onRequestBook(doctor).
 */
const MOCK_DOCTORS = [
  { id: "d1", name: "Dr. Aisha Roy", specialty: "General Physician", rating: 4.7, photo: "" },
  { id: "d2", name: "Dr. Rohit Mehra", specialty: "Cardiologist", rating: 4.9, photo: "" },
  { id: "d3", name: "Dr. S. Kapoor", specialty: "Pediatrics", rating: 4.6, photo: "" },
  { id: "d4", name: "Dr. Meena Iyer", specialty: "Dermatologist", rating: 4.5, photo: "" },
];

export default function AppointmentList({ onRequestBook = () => {} }) {
  return (
    <div className="doctor-list">
      {MOCK_DOCTORS.map((d) => (
        <DoctorCard key={d.id} doctor={d} onBook={() => onRequestBook(d)} />
      ))}
    </div>
  );
}
