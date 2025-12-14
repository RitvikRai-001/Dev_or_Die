import "../styles/doctor-home.css";

export default function AppointmentsTable({ data }) {
  return (
    <div className="card appointments-card">
      <h3 className="card-title">Upcoming Appointments</h3>

      <table className="appt-table">
        <thead>
          <tr>
            <th>Ranger Name</th>
            <th>Date & Time</th>
            <th>Mode</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty-row">
                No upcoming appointments.
              </td>
            </tr>
          ) : (
            data.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.datetime}</td>
                <td>{item.mode}</td>
                <td className="status-col">{item.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
