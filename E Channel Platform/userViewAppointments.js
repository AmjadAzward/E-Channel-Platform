import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./a.css";
import "./AdminHome.css";
import "./patientInterface.css";

const ScheduleList = () => {
  const [appointments, setAppointments] = useState([]);
  const [selectedDate, setSelectedDate] = useState(""); // State to store the selected date
  const navigate = useNavigate();

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch Appointments
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8085/appointment-details/schedules/available"
      );
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };

  const handleLogout = () => {
    // Implement logout functionality
  };

  const handleSelectChange = (event) => {
    // Implement select change functionality
  };

  // Handle date input change
  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  // Filter appointments by the selected date
  const filteredAppointments = selectedDate
    ? appointments.filter((appointment) => appointment.appointmentDate === selectedDate)
    : appointments;

  // Function to group appointments by date
  const groupAppointmentsByDate = () => {
    return filteredAppointments.reduce((groups, appointment) => {
      const { appointmentDate } = appointment;
      if (!groups[appointmentDate]) {
        groups[appointmentDate] = [];
      }
      groups[appointmentDate].push(appointment);
      return groups;
    }, {});
  };

  const groupedAppointments = groupAppointmentsByDate();

  return (
    <div>
      {/* Custom Navbar */}
      <nav className="navbar10">
        <div className="nav11">
          <h2 className="logo10" onClick={() => navigate("/AdminHome")}>
            APELLO
          </h2>

          <div className="nav-buttons10">
            <select className="search-bar510" onChange={handleSelectChange}>
              <option value="">What are you searching for....</option>
              <option value="doctor110">Book your appointments</option>
              <option value="doctor210">Check doctor availability</option>
              {/* Add more options as needed */}
            </select>

            <button onClick={() => navigate("/appointment")} className="nav-btn510">
              My Appointments
            </button>
            <button onClick={() => navigate("/UserAccount")} className="nav-btn510">
              My Profile
            </button>
            <button onClick={handleLogout} className="nav-btn510">
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Container for Appointment List */}
      <div className="appointment-list-container mt-4" style={{ padding: '0 20px' }}>
  {/* Input box to select date */}
  <div className="date-input-container">
    <label htmlFor="datePicker">Select a Date:</label>
    <input
      type="date"
      id="datePicker"
      value={selectedDate}
      onChange={handleDateChange}
    />
  </div>

  <div className="appointment-table-wrapper">
    {Object.keys(groupedAppointments).length > 0 ? (
      Object.keys(groupedAppointments).map((date) => (
        <div key={date}>
          <h4>{date}</h4> {/* Render date as a heading */}
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Appointment No</th>
                <th>Doctor Name</th>
                <th>Appointment Date</th>
                <th>Channel Start</th>
                <th>Channel End</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {groupedAppointments[date].map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.doctorName}</td>
                  <td>{appointment.appointmentDate}</td>
                  <td>{appointment.startTime}</td>
                  <td>{appointment.endTime}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => navigate("/appointment")}
                    >
                      Book your Appointment
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))
    ) : (
      <p>No appointments available</p>
    )}
  </div>
</div>

    </div>
  );
};

export default ScheduleList;
