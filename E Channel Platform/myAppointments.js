import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateNewAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [dateFilter, setDateFilter] = useState("all"); // New state for date filter
    const navigate = useNavigate();

    // Fetch appointments
    const fetchAppointments = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8085/appointment-details/appointments/patient/${id}`);
            setAppointments(response.data);
            setFilteredAppointments(response.data); // Initially display all appointments
        } catch (error) {
            console.error("Error fetching appointments", error);
        }
    };

    // Utility function to compare only the date part (ignoring time)
    const compareDates = (appointmentDate, filter) => {
        const currentDate = new Date();
        const appointmentDateObj = new Date(appointmentDate);

        // Remove time part for comparison
        currentDate.setHours(0, 0, 0, 0);
        appointmentDateObj.setHours(0, 0, 0, 0);

        if (filter === "before") {
            return appointmentDateObj < currentDate; // Before current date
        } else if (filter === "after") {
            return appointmentDateObj > currentDate; // After current date
        } else if (filter === "on") {
            return appointmentDateObj.getTime() === currentDate.getTime(); // On the current date
        }

        return false;
    };

    // Filter appointments based on date
    const filterAppointments = (filter) => {
        if (filter === "all") {
            setFilteredAppointments(appointments); // Show all appointments
        } else {
            const filtered = appointments.filter((appointment) => compareDates(appointment.date, filter));
            setFilteredAppointments(filtered); // Show filtered appointments
        }
    };

    // Handle date filter change
    const handleDateFilterChange = (e) => {
        const selectedFilter = e.target.value;
        setDateFilter(selectedFilter);
        filterAppointments(selectedFilter);
    };

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            axios.get(`http://localhost:8084/patient-details/${storedUsername}/id`)
                .then(response => {
                    fetchAppointments(response.data); // Fetch appointments based on patient ID
                })
                .catch(error => console.error("Error fetching patient data!", error));
        } else {
            console.error("Username is not available in localStorage.");
        }
    }, []);

    return (
        <>
            <nav className="navbar10" style={{ marginTop: '20px' }}>
                <div className="nav11">
                    <h2 className="logo10" onClick={() => navigate("/AdminHome")}>
                        APELLO
                    </h2>
                    <div className="nav-buttons10">
                        <button onClick={() => navigate("/appointment")} className="nav-btn510">
                            My Appointments
                        </button>
                        <button onClick={() => navigate("/UserAccount")} className="nav-btn510">
                            My Profile
                        </button>
                        <button onClick={() => localStorage.removeItem("username")} className="nav-btn510">
                            Logout
                        </button>
                    </div>
                </div>
            </nav>

            <div className="appointment-form mt-300">
                <h2 className="topic">Your Appointments</h2>

                {/* Combo Box for Filtering Appointments by Date */}
                <div className="filter-container">
                    <label htmlFor="dateFilter">Filter by Appointment Date: </label>
                    <select id="dateFilter" value={dateFilter} onChange={handleDateFilterChange}>
                        <option value="all">All Appointments</option>
                        <option value="before">Before Current Date</option>
                        <option value="after">After Current Date</option>
                        <option value="on">On Current Date</option>
                    </select>
                </div>

                <div className="appointment-cards-container">
                    {filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appointment) => (
                            <div key={appointment.id} className="card appointment-card">
                                <div className="card-body">
                                    <h5 className="card-title">Appointment Number: {appointment.id}</h5>
                                    <p className="card-text"><strong>Patient Name:</strong> {appointment.patientName}</p>
                                    <p className="card-text"><strong>Doctor Name:</strong> {appointment.doctorName}</p>
                                    <p className="card-text"><strong>Appointment Date:</strong> {appointment.date}</p>
                                    <p className="card-text"><strong>Appointment Time:</strong> {appointment.time}</p>
                                    <button className="btn btn-danger btn-sm" style={{ marginLeft: '10px' }}>Delete</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p>No appointments available</p>
                    )}
                </div>
            </div>

            <style jsx>{`
                .appointment-cards-container {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 20px;
                    margin: 40px auto;
                    padding: 20px;
                    box-sizing: border-box;
                    max-width: 1200px;
                }
                .appointment-card {
                    border: 1px solid #ddd;
                    padding: 20px;
                    border-radius: 8px;
                    background-color: #f9f9f9;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .appointment-card .card-title {
                    font-size: 18px;
                    font-weight: bold;
                }
                .appointment-card .card-text {
                    font-size: 14px;
                    margin: 5px 0;
                }
                .appointment-card .btn {
                    font-size: 12px;
                }

                .topic {
    text-align: center; /* Horizontally center the text */
    margin-top: 20px; /* Adjust the top margin as needed */
}

                /* Filter container */
                .filter-container {
                    margin: 20px 0;
                    padding: 10px;
                    background-color: #f5f5f5;
                    border-radius: 8px;
                    margin-left: 100px;
                    margin-right: 100px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }

                .filter-container label {
                    font-size: 16px;
                    font-weight: bold;
                    margin-right: 10px;
                }

                .filter-container select {
                    padding: 8px;
                    font-size: 14px;
                    border-radius: 4px;
                    border: 1px solid #ccc;
                }

                /* Responsive Design */
                @media (max-width: 768px) {
                    .appointment-cards-container {
                        grid-template-columns: repeat(2, 1fr);
                    }
                }

                @media (max-width: 480px) {
                    .appointment-cards-container {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </>
    );
};

export default CreateNewAppointment;
