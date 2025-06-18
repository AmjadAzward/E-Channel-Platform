import React, { useState } from 'react';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';


const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        contactNumber: '',
        email: '',
        username: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const checkContactExists = async (contact) => {
        try {
            const response = await axios.get(`http://localhost:8084/patient-details/patients/contacts?contact=${contact}`);
            return response.data;
        } catch (error) {
            console.error('Error checking contact:', error);
            return false;
        }
    };

    const checkUsernameExists = async (username) => {
        try {
            const response = await axios.get(`http://localhost:8084/patient-details/patients/usernames?user=${username}`);
            return response.data;
        } catch (error) {
            console.error('Error checking username:', error);
            return false;
        }
    };
    const checkEmailExists = async (email) => {
        try {
            const response = await axios.get(`http://localhost:8084/patient-details/patients/email?email=${email}`);
            return response.data;
        } catch (error) {
            console.error('Error checking email:', error);
            return false;
        }
    };


    const checkPassExists = async (password) => {
        try {
            const response = await axios.get(`http://localhost:8084/patient-details/patients/passwords?password=${password}`);
            return response.data;
        } catch (error) {
            console.error('Error checking password:', error);
            return false;
        }
    };

    const validate = async () => {
        let formErrors = {};
        if (!formData.name) formErrors.name = 'Name is required';
        if (!formData.age) formErrors.age = 'Age is required';
        if (!formData.gender) formErrors.gender = 'Gender is required';
        if (!formData.contactNumber) formErrors.contactNumber = 'Contact number is required';
        if (!formData.email) formErrors.email = 'Email is required';
        if (!formData.username) formErrors.username = 'Username is required';
        if (!formData.password) formErrors.password = 'Password is required';
        if (formData.password !== formData.confirmPassword) {
            formErrors.confirmPassword = 'Passwords must match';
        }
        if (!formData.confirmPassword) {
            formErrors.confirmPassword = 'Confirm password is required';
        }
        if (formData.contactNumber && !/^\d{10}$/.test(formData.contactNumber)) {
            formErrors.contactNumber = 'Contact number must be 10 digits';
        }


        // Check if email exists
        if (formData.email) {
            try {
                const emailExists = await checkEmailExists(formData.email);
                if (emailExists) {
                    formErrors.email = 'Email already exists';
                }
            } catch (error) {
                console.error('Error checking email:', error);
            }
        }
        // Check if email exists
        if (formData.password) {
            try {
                const passwordExists = await checkPassExists(formData.password);
                if (passwordExists) {
                    formErrors.password = 'Password already exists';
                }
            } catch (error) {
                console.error('Error checking password:', error);
            }
        }

        // Check if contact number exists
        if (formData.contactNumber) {
            try {
                const contactExists = await checkContactExists(formData.contactNumber);
                if (contactExists) {
                    formErrors.contactNumber = 'Contact number already exists';
                }
            } catch (error) {
                console.error('Error checking contact number:', error);
            }
        }
        // Check if username exists
        if (formData.username) {
            try {
                const usernameExists = await checkUsernameExists(formData.username);
                if (usernameExists) {
                    formErrors.username = 'Username already exists';
                }
            } catch (error) {
                console.error('Error checking username:', error);
            }
        }
        setErrors(formErrors); // Ensure errors are updated before returning


        if (formData.email && !/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(formData.email)) {
            formErrors.email = 'Invalid Email address';
        }
        return formErrors;
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = await validate();

        if (Object.keys(validationErrors).length === 0) {
            try {
                const response = await axios.post('http://localhost:8084/patient-details/patients', formData);
                console.log('Registration successful:', response.data);

                Swal.fire({
                    title: 'Success!',
                    text: 'Registration successful!',
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then(() => {
                    navigate('/login');
                });

            } catch (error) {
                console.error('Registration failed:', error.response?.data || error.message);

                Swal.fire({
                    title: 'Error!',
                    text: 'Registration failed. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        } else {
            setErrors(validationErrors);
        }
    };

    return (
        <div className="register-page">
            <div className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-brand">
                        <img src="C:\Picture1.png" alt="E Channel" className="navbar-logo" />
                    </Link>
                    <div className="navbar-links">
                        <button onClick={() => navigate("/Register")} className="nav-btn1">Sign Up</button>
                        <button onClick={() => navigate("/Login")} className="nav-btn2">Login</button>
                    </div>
                </div>
            </div>
            <div className="register-container">
                <div className="left-section">
                    <div>
                        <h2>Get Your Health Care Membership!</h2>
                    </div>
                    <div>
                        <p>Sign in and join with us </p>
                        <p>Healing begins when you connect with your inner self. Trust in the guidance that leads you to wellness.</p>
                    </div>
                </div>
                <div className="right-section">
                    <form onSubmit={handleSubmit} className="register-form">
                        <div className="form-grid">
                            <div className="form-column">
                                {['name', 'age', 'gender', 'email'].map((field) => (
                                    <div className="input-group" key={field}>
                                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                        {field === 'gender' ? (
                                            <select name={field} value={formData[field]} onChange={handleChange}>
                                                <option value="" selected disabled hidden>Select Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        ) : (
                                            <input
                                                type={field === 'age' ? 'number' : 'text'}
                                                name={field}
                                                value={formData[field]}
                                                onChange={handleChange}
                                                placeholder={`Enter your ${field}`}
                                            />
                                        )}
                                        <span className={`error ${errors[field] ? 'has-error' : ''}`}>
                                            {errors[field] || 'No error'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                            <div className="form-column">
                                {['contactNumber', 'username', 'password'].map((field) => (
                                    <div className="input-group" key={field}>
                                        <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                        <input
                                            type={field.includes('password') ? 'password' : 'text'}
                                            name={field}
                                            value={formData[field]}
                                            onChange={handleChange}
                                            placeholder={`Enter your ${field}`}
                                        />
                                        <span className={`error ${errors[field] ? 'has-error' : ''}`}>
                                            {errors[field] || 'No error'}
                                        </span>
                                    </div>
                                ))}
                                <div className="input-group">
                                    <label>Confirm Password</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Confirm your password"
                                    />
                                    <span className={`error ${errors.confirmPassword ? 'has-error' : ''}`}>
                                        {errors.confirmPassword || 'No error'}
                                    </span>
                                </div>
                            </div>
                        </div >
                        <button type="submit" className="submit-btn">Create Account</button>
                        <p className="login-link">
                            Already have an account? <Link to="/login" className='Reg'>Login here</Link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;