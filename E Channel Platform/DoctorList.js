import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./DoctorList.css";
import Swal from 'sweetalert2';

const DoctorList = () => {
    const [doctors, setDoctors] = useState([]);
    const [editDoctor, setEditDoctor] = useState(null);
    const [showAddDoctorForm, setShowAddDoctorForm] = useState(false);
    const [newDoctor, setNewDoctor] = useState({
        name: "",
        contactNumber: "",
        specialization: "",
    });

    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [deleteDoctorId, setDeleteDoctorId] = useState(null);
    const specializations = ["Cardiologist", "Dermatologist", "Neurologist", "Pediatrician", "Orthopedic", "General Physician"];

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // For sidebar toggle

    useEffect(() => {
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        const response = await axios.get("http://localhost:8083/doc-details/doctors");
        setDoctors(response.data);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewDoctor({ ...newDoctor, [name]: value });



        if (name === "contactNumber") {
            checkContactExists(value);
        }
    };

    const handleSpecializationChange = (e) => {
        const value = e.target.value;
        setNewDoctor({ ...newDoctor, specialization: value });
    };

    const [errorMessage, setErrorMessage] = useState("");

    const checkContactExists = async (contactNumber) => {
        if (!contactNumber) return;

        try {
            const response = await axios.get(`http://localhost:8083/doc-details/doctors/contacts`, {
                params: { contact: contactNumber }
            });

            if (response.data) {
                setErrorMessage("This contact number is already in use !");
            } else {
                setErrorMessage(""); // Clear the error if contact is unique
            }
        } catch (error) {
            setErrorMessage("Failed to check contact number. Please try again.");
        }
    };

    const handleInputChange1 = (e) => {
        const { name, value } = e.target;
        setNewDoctor({ ...newDoctor, [name]: value });

        if (name === "contactNumber") {
            checkContactExists(value);
        }
    };
    



    const saveNewDoctor = async () => {
        // Clear the error message before checking
        setErrorMessage("");

        // Validate if all fields are filled
        if (!newDoctor.name || !newDoctor.contactNumber || !newDoctor.specialization) {
            setErrorMessage("Please fill out all fields!");
            return; // Prevent save if any field is empty
        }

        // Check if the contact number already exists via an API call
        try {
            const response = await axios.get(`http://localhost:8083/doc-details/doctors/contacts?contact=${newDoctor.contactNumber}`);

            if (response.data.exists) {
                // If the contact number already exists, set an error
                setErrorMessage("The contact number is already in use!");
                return; // Prevent save
            }

            // Proceed to save if no errors
            await axios.post("http://localhost:8083/doc-details/doctors", newDoctor);

            // Clear the form fields and hide the form
            setNewDoctor({ name: "", contactNumber: "", specialization: "" });
            setShowAddDoctorForm(false);
            fetchDoctors(); // Fetch the updated list of doctors

            // Reset the error message on successful submission
            setErrorMessage("");

            Swal.fire("Doctor Added Successfully");
        } catch (error) {
            // Handle other API errors
            setErrorMessage("Failed to check contact number or add doctor. Please try again.");
        }
    };


    <button
        className="btn btn-success"
        onClick={saveNewDoctor}
        disabled={errorMessage !== ""} // Disable if there's an error
    >
        Save
    </button>


    const cancelAddDoctor = () => {
        setShowAddDoctorForm(false);
    };
    const [originalContactNumber, setOriginalContactNumber] = useState("");

    const handleEdit = (doctor) => {
        setEditDoctor({ ...doctor });
        setOriginalContactNumber(doctor.contactNumber);
    setEditDoctor(doctor);
    };
     
    const saveEdit = async () => {
        // Clear the error message before checking
        setErrorMessage("");
        
        // Validate if all fields are filled
        if (!editDoctor.name || !editDoctor.contactNumber || !editDoctor.specialization) {
            setErrorMessage("Please fill out all fields!");
            return; // Prevent save if any field is empty
        }
    
        // Check if the contact number is already in use
        const response = await axios.get(`http://localhost:8083/doc-details/doctors/contacts?contact=${editDoctor.contactNumber}`);
    
        if (response.data == true && editDoctor.contactNumber !== originalContactNumber) {
            // If the contact number already exists, set an error
            setErrorMessage("The contact number is already in use!");
            return; // Prevent save
        }


        // Proceed with saving the edited doctor
        try {

            await axios.put(`http://localhost:8083/doc-details/doctors/${editDoctor.id}`, editDoctor);
            setEditDoctor(null);
            fetchDoctors();
        } catch (error) {
            setErrorMessage("Failed to update doctor. Please try again.");
        }
    };
    
    
    



    const cancelEdit = () => {
        setEditDoctor(null);
    };

    const confirmDelete = async () => {
        await axios.delete(`http://localhost:8083/doc-details/doctors/${deleteDoctorId}`);
        setShowConfirmDelete(false);
        setDeleteDoctorId(null);
        fetchDoctors();
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
    };

    return (
        <div>
            {/* Sidebar Toggle Button */}
            <span className="sidebar-toggle-btn" onClick={toggleSidebar}>
                &#9776; {/* Hamburger Menu Icon */}
            </span>

            {/* Sidebar */}
            <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
                <button className="close-sidebar-btn" onClick={toggleSidebar}>
                </button>

                <ul>
                    <li><Link to="/AdminHome" >Home</Link></li>
                    <li><Link to="/Navbar">Doctors</Link></li>
                    <li><Link to="/PatientManage">Patients</Link></li>
                    <li><Link to="/ScheduleNav">Schedule</Link></li>
                    <li><Link to="/appointmentNav">Appointment</Link></li>

                </ul>
            </div>


            {/* Main Content */}
            <div className={`main-content ${isSidebarOpen ? "shifted" : ""}`}>
                <h2 className="text">Doctor Management</h2>

                {/* Add Doctor Button */}
                <button
                    className="btn btn-success mb-4"
                    onClick={() => setShowAddDoctorForm(!showAddDoctorForm)}
                >
                    {showAddDoctorForm ? "Cancel" : "Add Doctor"}
                </button>

                {/* Add Doctor Form */}
                {showAddDoctorForm && (
                    <div className="mb-4">
                        <h4>Add New Doctor</h4>
                        <div className="mb-3">
                            <label>Name:</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={newDoctor.name}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Contact:</label>
                            <input
                                type="text"
                                name="contactNumber"
                                className="form-control"
                                value={newDoctor.contactNumber}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="mb-3">
                            <label>Specialization:</label>
                            <select
                                name="specialization"
                                className="form-control"
                                value={newDoctor.specialization}
                                onChange={handleSpecializationChange}
                            >
                                <option value="">Select Specialization</option>
                                {specializations.map((spec, index) => (
                                    <option key={index} value={spec}>
                                        {spec}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {errorMessage && <p className="errormsg">{errorMessage}</p>}

                        <div className="d-flex justify-content-between">
                            <button className="btn btn-success" onClick={saveNewDoctor}>Save</button>
                            <button className="btn btn-secondary" onClick={cancelAddDoctor}>Cancel</button>
                        </div>
                    </div>
                )}

                {/* Doctor Cards */}
                <div className="row">
                    {doctors.map((doctor) => (
                        <div className="col-md-4 mb-4" key={doctor.id}>
                            <div className="card shadow-sm">
                                <div className="card-body">
                                    <h5 className="card-title">{doctor.name}</h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{doctor.specialization}</h6>
                                    <p className="card-text">
                                        <strong>Contact: </strong>{doctor.contactNumber}
                                    </p>
                                    {editDoctor && editDoctor.id === doctor.id ? (
                                        <div>
                                            <div className="mb-3">
                                                <label>Name:</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    className="form-control"
                                                    value={editDoctor.name}
                                                    onChange={(e) => setEditDoctor({ ...editDoctor, name: e.target.value })}
                                                />
                                            </div>
                                            <div className="mb-3">
                                                <label>Specialization:</label>
                                                <select
                                                    name="specialization"
                                                    className="form-control"
                                                    value={editDoctor.specialization}
                                                    onChange={(e) => setEditDoctor({ ...editDoctor, specialization: e.target.value })}
                                                >
                                                    {specializations.map((spec, index) => (
                                                        <option key={index} value={spec}>
                                                            {spec}
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
                                                    value={editDoctor.contactNumber}
                                                    onChange={(e) => setEditDoctor({ ...editDoctor, contactNumber: e.target.value })}
                                                />
                                            </div>
                                            {errorMessage && <p className="errormsg">{errorMessage}</p>}

                                            <div className="d-flex justify-content-between">
                                                <button className="btn btn-success btn-sm" onClick={saveEdit}>Save</button>
                                                <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="d-flex justify-content-between">
                                            <button
                                                className="btn btn-warning btn-sm"
                                                onClick={() => handleEdit(doctor)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => {
                                                    setShowConfirmDelete(true);
                                                    setDeleteDoctorId(doctor.id);
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

                {/* Delete Confirmation Modal */}
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
                                    <p>Are you sure you want to delete this doctor?</p>
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

export default DoctorList;
