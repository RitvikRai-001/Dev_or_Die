// src/components/appointments/SlotPicker.jsx
import React from "react";

/**
 * Simple horizontal slot picker showing available times.
 * params:
 * - slots: [{id, time: Date}]
 * - onSelect(slot)
 */

import "../../styles/components/SlotPicker.css";

export default function SlotPicker({ slots = [], onSelect = () => {} }) {
  return (
    <div className="slot-picker">
      {slots.map((s) => (
        <button
          key={s.id}
          className="slot"
          onClick={() => onSelect(s)}
          title={new Date(s.time).toLocaleString()}
        >
          {new Date(s.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </button>
      ))}
    </div>
  );
}
