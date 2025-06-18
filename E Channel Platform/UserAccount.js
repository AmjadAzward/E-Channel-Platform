import React, { useState, useEffect } from 'react';
import './UserAccount.css';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const Register = () => {
    const navigate = useNavigate();
    const [isEditable, setIsEditable] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        contactNumber: '',
        email: '',
        username: localStorage.getItem('username') || '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const [originalContactNumber, setOriginalContactNumber] = useState('');
    const [originalUserName, setOriginalUserName] = useState('');
    const [originalPassword, setOriginalPassword] = useState('');
    const [originalEmail, setOriginalEmail] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [originalData, setOriginalData] = useState({});

    useEffect(() => {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            axios.get(`http://localhost:8084/patient-details/patients/users/${storedUsername}`)
                .then(response => {
                    setFormData(response.data);
                    setOriginalData(response.data);
                })
                .catch(error => console.error("Error fetching patient data!", error));
        } else {
            console.error("Username is not available in localStorage.");
        }
    }, []);


    const validateForm = () => {
        let newErrors = {};
        const contactNumberPattern = /^\d{10}$/;
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

        if (!formData.name) newErrors.name = "Name is required!";
        if (!formData.age) newErrors.age = "Age is required!";
        if (!formData.gender) newErrors.gender = "Gender is required!";
        if (!formData.email) newErrors.email = "Email is required!";
        if (!formData.contactNumber) newErrors.contactNumber = "Contact number is required!";
        if (!formData.username) newErrors.username = "Username is required!";
        if (!formData.password) newErrors.password = "Password is required!";

        if (formData.contactNumber && !contactNumberPattern.test(formData.contactNumber)) {
            newErrors.contactNumber = "Contact number must be exactly 10 digits!";
        }

        if (formData.email && !emailPattern.test(formData.email)) {
            newErrors.email = "Invalid email format!";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const checkIfExists = async (field, value, originalValue, endpoint) => {
        if (value !== originalValue) {
            const response = await axios.get(`http://localhost:8084/patient-details/patients/${endpoint}?${field}=${value}`);
            if (response.data === true) {
                setErrorMessage(`The ${field} is already in use!`);
                return true;
            }
        }
        return false;
    };

    const handleUpdate = async () => {
        setErrors({}); // Reset errors before validation

        if (!validateForm()) return;

        try {
            const checks = await Promise.all([
                checkIfExists("contact", formData.contactNumber, originalData.contactNumber, "contacts"),
                checkIfExists("email", formData.email, originalData.email, "emails"),
                checkIfExists("user", formData.username, originalData.username, "usernames"),
                checkIfExists("password", formData.password, originalData.password, "passwords"),
            ]);

            if (checks.includes(true)) return;

            const idResponse = await axios.get(`http://localhost:8084/patient-details/id-by-contact/${originalData.contactNumber}`);
            const patientId = idResponse.data;

            if (!patientId) {
                setErrorMessage("Patient ID not found.");
                return;
            }

            await axios.put(`http://localhost:8084/patient-details/patients/${patientId}`, formData);
            Swal.fire("User account updated successfully!");
            navigate('/UserAccount');
        } catch (error) {
            console.error("Failed to update patient:", error);
            setErrorMessage("Failed to update patient. Please try again.");
        }
    };





    const handleCheckboxChange = (e) => setIsEditable(e.target.checked);

    const handleLogout = () => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you really want to logout?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, Logout!",
        }).then((result) => {
            if (result.isConfirmed) {
                localStorage.removeItem('username');
                navigate("/");
            }
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };



    return (
        <div className="register-page">
            <div className="navbar4">
                <div className="navbar-container5">
                    <h2 className="logo" onClick={() => navigate("/AdminHome")}>APELLO</h2>
                    <div className="nav-buttons">
                        <button onClick={() => navigate("/appointment")} className="nav-btn5">My Appointments</button>
                        <button onClick={() => navigate("/UserAccount")} className="nav-btn5">My Profile</button>
                        <button onClick={handleLogout} className="nav-btn5">Logout</button>
                    </div>
                </div>
            </div>
            <div className="register-container">
                <div className="left-section">
                    <h2>Get your premium health care services!</h2>
                    <p>Search your doctor and set your appointment</p>
                </div>
                <div className="right-section">
                    <form className="register-form">
                        <div className="form-grid">
                            <div className="form-column">
                                {["name", "age", "gender", "email"].map((field) => (
                                    <div className="input-group" key={field}>
                                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                        {field === "gender" ? (
                                            <select
                                                name={field}
                                                value={formData[field]}
                                                onChange={handleChange}
                                                disabled={!isEditable}
                                            >
                                                <option value="" disabled hidden>Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        ) : (
                                            <input
                                                type={field === "age" ? "number" : "text"}
                                                name={field}
                                                value={formData[field]}
                                                onChange={handleChange}
                                                placeholder={`Enter your ${field}`}
                                                disabled={!isEditable}
                                            />
                                        )}
                                        <span className={`error ${errors[field] ? 'has-error' : ''}`}>{errors[field] || 'No error'}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="form-column">
                                {["contactNumber", "username", "password"].map((field) => (
                                    <div className="input-group" key={field}>
                                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                        <input
                                            type={field.includes("password") ? "password" : "text"}
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            placeholder={`Enter your ${field}`}
                                            disabled={!isEditable}
                                        />
                                        <span className={`error ${errors[field] ? 'has-error' : ''}`}>{errors[field] || 'No error'}</span>
                                    </div>
                                ))}
                                <div className="input-group7">
                                    <input type="checkbox" className='check' onChange={handleCheckboxChange} />
                                    <label className='txt'>Select if you need to edit your profile data</label>
                                </div>
                            </div>
                        </div>
                        {isEditable && (
                            <>
                                <button type="button" className="edit-btn5" onClick={handleUpdate}>Edit</button>
                                <button type="button" className="cancel-btn5" onClick={() => { setIsEditable(false); document.querySelector('.check').checked = false; navigate("/UserAccount"); }}>Cancel</button>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;
