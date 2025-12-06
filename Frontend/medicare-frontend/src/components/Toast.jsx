import { useEffect } from "react";
import "../styles/index.css";

export default function Toast({ message, onClose }) {
  useEffect(() => {
    const id = setTimeout(onClose, 3000);
    return () => clearTimeout(id);
  }, [onClose]);

  return (
    <div className="toast">
      <span className="icon">✅</span>
      <span>{message}</span>
    </div>
  );
}
