// CreateNewAppointment.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";


const CreateNewAppointment = () => {
    const [appointments, setAppointments] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [contacts, setContacts] = useState([]);
    const [contact, setdocContacts] = useState([]);

    const handleLogout = () => {
        // Implement logout functionality
    };

    const handleSelectChange = (event) => {
        // Implement select change functionality
    };
    const navigate = useNavigate();

    const [newAppointment, setNewAppointment] = useState({
        patientId: "",
        patientName: "",
        doctorId: "",
        doctorName: "",
        appointmentDate: "",
        appointmentTime: ""
    });


    const [editAppointment, seteditAppointment] = useState({
        patientId: "",
        patientName: "",
        doctorId: "",
        doctorName: "",
        appointmentDate: "",
        appointmentTime: ""



    });


    const [errorMessage, setErrorMessage] = useState("");
    const [showAddForm, setShowAddForm] = useState(false);

    // States for specializations
    const [specializations, setSpecializations] = useState([]);
    const [selectedSpecialization, setSelectedSpecialization] = useState("");

    useEffect(() => {
        fetchAppointments();
        fetchDoctorsnames();
        fetchDocContacts();
        fetchPatients();
        fetchDates();
        fetchContacts();
        fetchSpecializations(); // Fetch specializations when the component is mounted
    }, []);

    // Fetch Appointments
    const fetchAppointments = async () => {
        try {
            const response = await axios.get("http://localhost:8085/appointment-details/appointments");
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments", error);
        }
    };

    // Fetch Doctors (Initial)
    const fetchDoctorsnames = async () => {
        try {
            const response = await axios.get("http://localhost:8083/doc-details/doctors/doctor-names");
            setDoctors(response.data);
        } catch (error) {
            console.error("Error fetching doctors", error);
        }
    };

    const fetchDocContacts = async () => {
        try {
            const response = await axios.get("http://localhost:8083/doc-details/doctors/contacts");
            setdocContacts(response.data);
        } catch (error) {
            console.error("Error fetching contacts", error);
        }
    };

    // Fetch Specializations
    const fetchSpecializations = async () => {
        try {
            const response = await axios.get("http://localhost:8083/doc-details/doctors/specializations");
            setSpecializations(response.data);
        } catch (error) {
            console.error("Error fetching specializations", error);
        }
    };

    // Fetch Patients
    const fetchPatients = async () => {
        try {
            const response = await axios.get("http://localhost:8084/admin/patients");
            setPatients(response.data);
        } catch (error) {
            console.error("Error fetching patients", error);
        }
    };

    // Fetch Contacts
    const fetchContacts = async () => {
        try {
            const response = await axios.get("http://localhost:8084/patient-details/contacts");
            setContacts(response.data);
        } catch (error) {
            console.error("Error fetching contacts", error);
        }
    };

    // Handle Input Change for form fields
    const handleInputChange = async (e) => {
        const { name, value } = e.target;

        // If patient contact is changed, fetch patient details
        if (name === "patientContact") {
            try {
                const response = await axios.get(`http://localhost:8084/patient-details/details/${value}`);
                const patientData = response.data.length > 0 ? response.data[0] : null;

                if (patientData) {
                    setNewAppointment((prev) => ({
                        ...prev,
                        patientContact: value,
                        patientId: patientData.id || "",
                        patientName: patientData.name || "",
                    }));
                } else {
                    console.warn("No patient data found.");
                }
            } catch (error) {
                console.error("Error fetching patient details", error);
            }
        } else {
            setNewAppointment((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };


    // Fetch available dates for the appointments
    const [dates, setDates] = useState([]);

    const handleFetchDates = () => {
        if (editingAppointment.doctorId !== null) {
            const doctorId = editingAppointment.doctorId;
            console.log(doctorId);

            if (doctorId) {
                fetchDates(doctorId);
            }
        }

    };


    const fetchDates = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8085/appointment-details/schedules/dates/${id}`);
            setDates(response.data);
        } catch (error) {
            console.error("Error fetching appointment dates:", error);
        }
    };

    // Fetch available times for a specific date
    const [times, setTimes] = useState([]);

    const fetchTimesForDate = async (date) => {
        try {
            const response = await axios.get(`http://localhost:8085/appointment-details/schedules/times/${date}`);
            setTimes(response.data);
        } catch (error) {
            console.error("Error fetching appointment times:", error);
        }
    };

    // Fetch dates when the component mounts


    // Handle date change and fetch corresponding times
    const handleDateChange = (e) => {
        const selectedDate = e.target.value;
        setNewAppointment((prev) => ({
            ...prev,
            appointmentDate: selectedDate,
        }));
        fetchTimesForDate(selectedDate); // Fetch times when a date is selected
    };

    const handleInputsChange = async (e) => {
        const { name, value } = e.target;

        if (name === "doctorName") {
            setNewAppointment((prev) => ({
                ...prev,
                doctorName: value,
            }));

            try {
                const response = await axios.get(`http://localhost:8083/doc-details/doctors/search?name=${value}&specialization=${selectedSpecialization}`);
                if (response.data) {
                    setNewAppointment((prev) => ({
                        ...prev,
                        doctorId: response.data,
                    }));
                    fetchDates(response.data);
                }
            } catch (error) {
                console.error("Error fetching doctor ID", error);
            }
        } else {
            setNewAppointment((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };






    const [formSubmitted, setFormSubmitted] = useState(false);

    const addNewAppointment = async () => {
        setFormSubmitted(true); // Mark form as submitted when user clicks submit

        if (
            !newAppointment.appointmentDate ||
            !newAppointment.appointmentTime ||
            !newAppointment.doctorId ||
            !newAppointment.doctorName ||
            !newAppointment.patientId ||
            !newAppointment.patientName
        ) {
            setErrorMessage("All fields are required!");
            return; // Stop execution if any field is missing
        }

        try {
            const appointmentRequestBody = {
                date: newAppointment.appointmentDate,
                time: newAppointment.appointmentTime,
                doctorId: newAppointment.doctorId,
                doctorName: newAppointment.doctorName,
                patientId: newAppointment.patientId,
                patientName: newAppointment.patientName
            };

            const response = await axios.post("http://localhost:8085/appointment-details/appointments", appointmentRequestBody);
            console.log("Response from server:", response);

            // Reset form fields and error state
            setNewAppointment({
                patientId: "",
                patientName: "",
                doctorId: "",
                doctorName: "",
                appointmentDate: "",
                appointmentTime: ""
            });

            setFormSubmitted(false); // Reset form submission tracking
            setShowAddForm(false);
            fetchAppointments();
            Swal.fire("Appointment Added Successfully", "", "success");
        } catch (error) {
            console.error("Error occurred while adding appointment:", error);
            setErrorMessage("Failed to add appointment. Please try again.");
        }
    };





    const handleSpecializationsChange = async (e) => {
        const specialization = e.target.value;
        setSelectedSpecialization(specialization);

        if (specialization) {
            try {
                const response = await axios.get(`http://localhost:8083/doc-details/doctors?spec=${specialization}`);
                setDoctors(response.data);
            } catch (error) {
                console.error("Error fetching doctors for specialization", error);
            }
        } else {
            setDoctors([]);
        }
    };

    const [availableTimes, setAvailableTimes] = useState([]);

    // Handle Date Change and Fetch Available Time
    const handleDateChange1 = async (e) => {
        const selectedDate = e.target.value;

        // Set the selected date
        setNewAppointment((prev) => ({
            ...prev,
            appointmentDate: selectedDate,
        }));

        // Fetch available times for the selected date and doctor
        if (selectedDate && newAppointment.doctorId) {
            try {
                const response = await axios.get(`http://localhost:8085/appointment-details/schedules/dates-for-time/${selectedDate}/${newAppointment.doctorId}`);
                setAvailableTimes(response.data);  // Update available times based on the selected date and doctor
            } catch (error) {
                console.error("Error fetching available times:", error);
            }
        } else {
            setAvailableTimes([]); // Reset times if no date or doctor is selected
        }
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
    };
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // For sidebar toggle













    const [editingAppointment, setEditingAppointment] = useState(null);
    const [isEditFormOpen, setIsEditFormOpen] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);



    const handleEditClick = (appointment) => {
        setEditingAppointment(appointment);
        setIsEditFormOpen(true);
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditingAppointment((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const updateAppointment = async () => {
        try {
            await axios.put(
                `http://localhost:8085/appointment-details/appointments/${editingAppointment.id}`,
                editingAppointment
            );
            Swal.fire("Appointment Updated Successfully", "", "success");
            setIsEditFormOpen(false);
            fetchAppointments();
        } catch (error) {
            console.error("Error updating appointment:", error);
            Swal.fire("Failed to update appointment!", "", "error");
        }
    };



    const handleEdit = (appointment) => {
        setEditingAppointment(appointment);
        setIsEditFormOpen(true);
    };


    const handleUpdate = () => {
        updateAppointment(editingAppointment);
        setIsEditFormOpen(false);
        setEditingAppointment(null);
    };


    const fetchDoctorId = async (doctorId) => {
        try {
            editAppointment((prevState) => ({
                ...prevState,
                doctorId: doctorId,  // Update doctorName in the form state
            }));

            console.log("Fetching doctor ID with parameters:");
            console.log("Doctor Name:", doctorId);



            // Ensure that you are passing the specialization properly
            const response = await axios.get(`http://localhost:8085/appointment-details/schedules/dates/${doctorId}`);


            if (response.data) {
                console.log("Response:", response.data);

                const doctorId = response.data;
                updateAppointment((prevState) => ({
                    ...prevState,
                    doctorId: doctorId,
                }));

                document.getElementById("docId").value = doctorId;

                console.log("Doctor ID:", doctorId);

                // Update the state with the new schedule
                handleUpdateAppointment((prevState) => ({
                    ...prevState,
                    doctorId// Save the doctorId to state
                }));
            }
        } catch (error) {
            console.error("Error fetching doctor ID:", error);
        }
    };



    const handleUpdateAppointment = async () => {
        try {
            await axios.put(
                `http://localhost:8085/appointment-details/appointments/${editingAppointment.id}`,
                editingAppointment
            );
            Swal.fire("Appointment Updated Successfully", "", "success");
            setIsEditFormOpen(false);  // Close the edit form after successful update
            setEditingAppointment(null);  // Reset the editing state
            fetchAppointments();  // Refresh the appointments list
        } catch (error) {
            console.error("Error updating appointment:", error);
            Swal.fire("Failed to update appointment!", "", "error");
        }
    };


    return (
        <>
            <nav className="navbar10" style={{ marginTop: '20px' }}> {/* Adjust margin as needed */}
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


    <div className="appointment-form mt-200">
        

        {/* Patient Contact */}
        <div className="container10">
        <h2  style={{ textAlign: 'center' }}>Book an Appointment</h2>


        <select name="patientContact" value={newAppointment.patientContact} onChange={handleInputChange} className="form-control mb-3">
            <option value="">Select Patient Contact</option>
            {contacts.map((contact) => (
                <option key={contact} value={contact}>{contact}</option>
            ))}
        </select>

        {/* Patient Details */}
        <div className="mb-3">
            <input type="text" name="patientId" placeholder="Patient ID" value={newAppointment.patientId} className="form-control" readOnly />
        </div>
        <div className="mb-3">
            <input type="text" name="patientName" placeholder="Patient Name" value={newAppointment.patientName} className="form-control" readOnly />
        </div>

        {/* Specialization Dropdown */}
        <select name="doctorSpecialization" value={selectedSpecialization} onChange={handleSpecializationsChange} className="form-control mb-3">
            <option value="">Select Specialization</option>
            {specializations.map((specialization, index) => (
                <option key={index} value={specialization}>{specialization}</option>
            ))}
        </select>

        {/* Doctor Dropdown */}
        <select name="doctorName" value={newAppointment.doctorName} onChange={handleInputsChange} className="form-control mb-3">
            <option value="">Select Doctor</option>
            {doctors.map((doctor, index) => (
                <option key={index} value={doctor}>{doctor}</option>
            ))}
        </select>

        {/* Doctor ID */}
        <div className="mb-3">
            <input
                type="text"
                name="doctorId"
                placeholder="Doctor ID"
                value={newAppointment.doctorId}
                className="form-control"
                readOnly
            />
        </div>

        <label>Appointment Date</label>

        {/* Appointment Date Dropdown */}
        <select
            name="appointmentDate"
            value={newAppointment.appointmentDate}
            onChange={handleDateChange1}
            className="form-control mb-3"
        >
            <option value="">Select Date</option>
            {dates.length > 0 ? (
                dates.map((date, index) => (
                    <option key={index} value={date}>
                        {date}
                    </option>
                ))
            ) : (
                <option disabled>No available dates</option>
            )}
        </select>

        {/* Appointment Time Dropdown */}
        <select name="appointmentTime" value={newAppointment.appointmentTime} onChange={handleInputChange} className="form-control mb-3">
            <option value="">Select Time Slot</option>
            {availableTimes.map((time, index) => (
                <option key={index} value={time}>
                    {time}
                </option>
            ))}
        </select>

        {/* Error Message */}
        {errorMessage && <p className="errormsg">{errorMessage}</p>}

        {/* Buttons */}
        <div className="d-flex justify-content-between">
            <button className="btn btn-success" onClick={addNewAppointment}>Save</button>
            <button className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
        </div>
    </div>
</div>

        </>
    );
};

export default CreateNewAppointment;
