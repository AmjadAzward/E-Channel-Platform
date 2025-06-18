import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./DoctorList.css";
import Navbar from "./Navbar";
import Swal from 'sweetalert2';
import ScheduleNav from "./schedulenav";



const PatientList = () => {
    const [errorMessage, setErrorMessage] = useState("");

    const [patients, setPatients] = useState([]);
    const [editPatient, setEditPatient] = useState(null);
    const [showAddPatientForm, setShowAddPatientForm] = useState(false);
    const [newPatient, setNewPatient] = useState({
        name: "",
        contactNumber: "",
        age: "",
        gender: "",
        username: "",
        password: "",
        email: "",
    });

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deletePatientId, setDeletePatientId] = useState(null);
    const genders = ["Male", "Female", "Other"];

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        const response = await axios.get("http://localhost:8084/patient-details/patients");
        setPatients(response.data);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewPatient({ ...newPatient, [name]: value });
    };

    const handleGenderChange = (e) => {
        const value = e.target.value;
        setNewPatient({ ...newPatient, gender: value });
    };

    const saveNewPatient = async () => {
        setErrorMessage("");

        // Validate if all fields are filled
        if (!newPatient.name || !newPatient.contactNumber || !newPatient.age || !newPatient.gender || !newPatient.username || !newPatient.password || !newPatient.email) {
            setErrorMessage("Please fill out all fields!");
            return; // Prevent save if any field is empty
        }

        // Check if the contact number already exists via an API call
        try {
            const response1 = await axios.get(`http://localhost:8084/patient-details/patients/contacts?contact=${newPatient.contactNumber}`);

            if (response1.data === true) {
                // If the contact number already exists, set an error
                setErrorMessage("The contact number is already in use!");
                return; // Prevent save
            }

            // Validate contact number format (10-digit numeric)
            const contactNumberPattern = /^\d{10}$/;
            if (!contactNumberPattern.test(newPatient.contactNumber)) {
                setErrorMessage("Contact number must be exactly 10 digits!");
                return;
            }

            // Validate email format
            const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailPattern.test(newPatient.email)) {
                setErrorMessage("Invalid email format!");
                return;
            }

            const response2 = await axios.get(`http://localhost:8084/patient-details/patients/emails?email=${newPatient.email}`);

            if (response2.data === true) {
                // If the contact number already exists, set an error
                setErrorMessage("The email is already in use!");
                return; // Prevent save
            }

            const response3 = await axios.get(`http://localhost:8084/patient-details/patients/usernames?user=${newPatient.username}`);

            if (response3.data === true) {
                // If the contact number already exists, set an error
                setErrorMessage("The username is already in use!");
                return; // Prevent save
            }

            const response4 = await axios.get(`http://localhost:8084/patient-details/patients/passwords?password=${newPatient.password}`);

            if (response4.data === true) {
                // If the contact number already exists, set an error
                setErrorMessage("The password is already in use!");
                return; // Prevent save
            }

            // Proceed to save if no errors
            await axios.post("http://localhost:8084/patient-details/patients", newPatient);

            // Clear the form fields and hide the form
            setNewPatient({ name: "", contactNumber: "", age: "", gender: "", username: "", password: "", email: "" });
            setShowAddPatientForm(false);
            fetchPatients();
            setErrorMessage("");

            Swal.fire("Patient Added Successfully");
        } catch (error) {
            // Handle other API errors
            setErrorMessage("Failed to check contact number or add doctor. Please try again.");
        }

    };



    const [originalContactNumber, setOriginalContactNumber] = useState("");
    const [originalUserName, setOriginalUserName] = useState("");
    const [originalPassword, setOriginalPassword] = useState("");
    const [originalEmail, setOriginalEmail] = useState("");



    const cancelAddPatient = () => {
        setShowAddPatientForm(false);
    };

    const handleEdit = (patient) => {
        setEditPatient({ ...patient });
        setOriginalContactNumber(patient.contactNumber);
        setOriginalUserName(patient.username);
        setOriginalPassword(patient.password);
        setOriginalEmail(patient.email);

    };


    const saveEditPatient = async () => {
        // Clear the error message before checking
        setErrorMessage("");

        console.log("Starting saveEditPatient...");

        // Validate if all fields are filled
        if (!editPatient.name || !editPatient.contactNumber || !editPatient.age ||
            !editPatient.gender || !editPatient.username || !editPatient.password || !editPatient.email) {
            setErrorMessage("Please fill out all fields!");
            console.log("Error: Some fields are empty.");
            return; // Prevent save if any field is empty
        }

        console.log("All required fields are filled.");

        // Validate contact number format (10-digit numeric)
        const contactNumberPattern = /^\d{10}$/;
        if (!contactNumberPattern.test(editPatient.contactNumber)) {
            setErrorMessage("Contact number must be exactly 10 digits!");
            console.log("Error: Invalid contact number format.");
            return;
        }

        console.log("Contact number is valid.");

        // Validate email format
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(editPatient.email)) {
            setErrorMessage("Invalid email format!");
            console.log("Error: Invalid email format.");
            return;
        }

        console.log("Email format is valid.");

        try {
            console.log("Checking if contact number already exists...");
            const response1 = await axios.get(`http://localhost:8084/patient-details/patients/contacts?contact=${editPatient.contactNumber}`);
            console.log("Contact number check response:", response1.data);

            if (response1.data === true && editPatient.contactNumber !== originalContactNumber) {
                setErrorMessage("The contact number is already in use!");
                console.log("Error: Contact number already in use.");
                return;
            }

            console.log("Checking if email already exists...");
            const response2 = await axios.get(`http://localhost:8084/patient-details/patients/emails?email=${editPatient.email}`);
            console.log("Email check response:", response2.data);

            if (response2.data === true && editPatient.email !== originalEmail) {
                setErrorMessage("The email is already in use!");
                console.log("Error: Email already in use.");
                return;
            }

            console.log("Checking if username already exists...");
            const response3 = await axios.get(`http://localhost:8084/patient-details/patients/usernames?user=${editPatient.username}`);
            console.log("Username check response:", response3.data);

            if (response3.data === true && editPatient.username !== originalUserName) {
                setErrorMessage("The username is already in use!");
                console.log("Error: Username already in use.");
                return;
            }

            console.log("Checking if password already exists...");
            const response4 = await axios.get(`http://localhost:8084/patient-details/patients/passwords?password=${editPatient.password}`);
            console.log("Password check response:", response4.data);

            if (response4.data === true && editPatient.password !== originalPassword) {
                setErrorMessage("The password is already in use!");
                console.log("Error: Password already in use.");
                return;
            }

            console.log("Fetching patient ID using contact number...");
            const idResponse = await axios.get(`http://localhost:8084/patient-details/id-by-contact/${originalContactNumber}`);
            console.log("Patient ID response:", idResponse.data);

            const patientId = idResponse.data;
            if (!patientId) {
                setErrorMessage("Patient ID not found for the given contact number.");
                console.log("Error: Patient ID not found.");
                return;
            }

            console.log("Updating patient with ID:", patientId);
            console.log("Updated patient data:", editPatient);

            await axios.put(`http://localhost:8084/patient-details/patients/${patientId}`, editPatient);

            console.log("Patient updated successfully!");
            setEditPatient(null);
            fetchPatients();

            Swal.fire("Patient updated successfully!");
        } catch (error) {
            console.error("Failed to update patient:", error);
            setErrorMessage("Failed to update patient. Please try again.");
        }
    };



    const cancelEdit = () => {
        setEditPatient(null);
    };

    const confirmDelete = async () => {
        await axios.delete(`http://localhost:8084/patient-details/patients/${deletePatientId}`);
        setShowConfirmDelete(false);
        setDeletePatientId(null);
        fetchPatients();
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div>
            <span className="sidebar-toggle-btn" onClick={toggleSidebar}>
                &#9776;
            </span>

            <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <button className="close-sidebar-btn" onClick={toggleSidebar}></button>
                <ul>
                    <li><Link to="/AdminHome" >Home</Link></li>
                    <li><Link to="/Navbar">Doctors</Link></li>
                    <li><Link to="/PatientManage">Patients</Link></li>
                    <li><Link to="/ScheduleNav">Schedule</Link></li>
                    <li><Link to="/appointmentNav">Appointment</Link></li>


                </ul>
            </div>

            <div className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
                <h2 className="text">Patient Management</h2>

                <button
                    className="btn btn-success mb-4"
                    onClick={() => setShowAddPatientForm(!showAddPatientForm)}
                >
                    {showAddPatientForm ? "Cancel" : "Add Patient"}
                </button>

                {showAddPatientForm && (
                    <div className="mb-4">
                        <h4>Add New Patient</h4>
                        <div className="mb-3">
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={newPatient.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Contact:</label>
                            <input
                                type="text"
                                name="contactNumber"
                                className="form-control"
                                value={newPatient.contactNumber}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Age:</label>
                            <input
                                type="text"
                                name="age"
                                className="form-control"
                                value={newPatient.age}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Gender:</label>
                            <select
                                name="gender"
                                className="form-control"
                                value={newPatient.gender}
                                onChange={handleGenderChange}
                            >
                                <option value="">Select Gender</option>
                                {genders.map((gender, index) => (
                                    <option key={index} value={gender}>
                                        {gender}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="mb-3">
                            <label>Username:</label>
                            <input
                                type="text"
                                name="username"
                                className="form-control"
                                value={newPatient.username}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Password:</label>
                            <input
                                type="password"
                                name="password"
                                className="form-control"
                                value={newPatient.password}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Email:</label>
                            <input
                                type="email"
                                name="email"
                                className="form-control"
                                value={newPatient.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        {errorMessage && <p className="errormsg">{errorMessage}</p>}

                        <div className="d-flex justify-content-between">
                            <button className="btn btn-success" onClick={saveNewPatient}>Save</button>
                            <button className="btn btn-secondary" onClick={cancelAddPatient}>Cancel</button>
                        </div>
                    </div>
                )}

                <div className="row">
                    {patients.map((patient) => (
                        <div className="col-md-4 mb-4" key={patient.id}>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{patient.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{patient.age} years old</h6>
                                    <p className="card-text">
                                        <strong>Contact: </strong>{patient.contactNumber}
                                    </p>
                                    {editPatient && editPatient.id === patient.id ? (
                                        <div>
                                            <div className="mb-3">
                                                <label>Name:</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="form-control"
                                                    value={editPatient.name}
                                                    onChange={(e) => setEditPatient({ ...editPatient, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label>Age:</label>
                                                <input
                                                    type="text"
                                                    name="age"
                                                    className="form-control"
                                                    value={editPatient.age}
                                                    onChange={(e) => setEditPatient({ ...editPatient, age: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label>Gender:</label>
                                                <select
                                                    name="gender"
                                                    className="form-control"
                                                    value={editPatient.gender}
                                                    onChange={(e) => setEditPatient({ ...editPatient, gender: e.target.value })}
                                                >
                                                    {genders.map((gender, index) => (
                                                        <option key={index} value={gender}>
                                                            {gender}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="mb-3">
                                                <label>Contact:</label>
                                                <input
                                                    type="text"
                                                    name="contactNumber"
                                                    className="form-control"
                                                    value={editPatient.contactNumber}
                                                    onChange={(e) => setEditPatient({ ...editPatient, contactNumber: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label>Username:</label>
                                                <input
                                                    type="text"
                                                    name="username"
                                                    className="form-control"
                                                    value={editPatient.username}
                                                    onChange={(e) => setEditPatient({ ...editPatient, username: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label>Password:</label>
                                                <input
                                                    type="password"
                                                    name="password"
                                                    className="form-control"
                                                    value={editPatient.password}
                                                    onChange={(e) => setEditPatient({ ...editPatient, password: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label>Email:</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    className="form-control"
                                                    value={editPatient.email}
                                                    onChange={(e) => setEditPatient({ ...editPatient, email: e.target.value })}
                                                />
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                {errorMessage && <p className="errormsg">{errorMessage}</p>}

                                                <button className="btn btn-success btn-sm" onClick={saveEditPatient}>Save</button>
                                                <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="d-flex justify-content-between">

                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => handleEdit(patient)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => {
                                                    setShowConfirmDelete(true);
                                                    setDeletePatientId(patient.id);
                                                }}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {showConfirmDelete && (
                    <div className="modal show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1" role="dialog">
                        <div className="modal-dialog">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Confirm Deletion</h5>
                                    <button
                                        type="button"
                                        className="close"
                                        onClick={() => setShowConfirmDelete(false)}
                                    >
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <p>Are you sure you want to delete this patient?</p>
                                </div>
                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={confirmDelete}
                                    >
                                        Yes, Delete
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={() => setShowConfirmDelete(false)}
                                    >
                                        No, Cancel
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PatientList;
