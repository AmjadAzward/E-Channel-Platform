import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const ScheduleList = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate(); // Define navigate

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

  return (
    
    <div>
      <h2>Time Slots</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>ID</th>
            <th>Doctor Name</th>
            <th>Appointment Date</th>
            <th>Channel Start</th>
            <th>Channel End</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.length > 0 ? (
            appointments.map((appointment) => (
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
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center">
                No appointments available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ScheduleList;
