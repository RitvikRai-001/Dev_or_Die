export default function RoleSelector({ value, onChange }) {
  return (
    <select
      className="input-field"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    >
      <option value="ranger">Ranger (Patient)</option>
      <option value="doctor">Doctor</option>
    </select>
  );
}
