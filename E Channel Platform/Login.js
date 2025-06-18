import React, { useState } from 'react';
import './Login.css'; 
import { Link } from 'react-router-dom'; 
import { useNavigate } from "react-router-dom";
import axios from 'axios'; 
import Swal from 'sweetalert2'; 

const Login = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ 
        username: '',
        password: '',
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    // Handle form field change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    // Client-side validation for empty fields
    const validate = () => {
        let formErrors = {};

        if (!formData.username) formErrors.username = 'Username is required';
        if (!formData.password) formErrors.password = 'Password is required';

        return formErrors;
    };

// Handle form submission
const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length === 0) {
        setIsLoading(true);

        if (formData.username === "ADMIN" && formData.password === "ADMIN123") {
            Swal.fire('Login Successful', 'You have logged in successfully as ADMIN!', 'success');
            navigate('/AdminHome'); 
        } else {
            try {
                const response = await axios.get(`http://localhost:8084/patient-details/patients/logins?username=${formData.username}&password=${formData.password}`);
                
                console.log("API Response:", response.data); // Debugging

                // Check if API returns a string (patient name)
                if (typeof response.data === "string" && response.data.trim().length > 0) {
                    Swal.fire('Login Successful', `Welcome, ${response.data}!`, 'success');
                    const username = 'johndoe1';  // Or get this value dynamically
                    console.log("Setting username in localStorage:", formData.username);
                    localStorage.setItem('username', formData.username); // Store username in localStorage

                    navigate("/UserAccount");  // Navigate to the profile p

                    navigate('/patient-interface');
                } else {
                    Swal.fire('Login Failed', 'Invalid username or password', 'error');
                }
            } catch (error) {
                console.error("Login error:", error);
                Swal.fire('Error', 'An error occurred while trying to log in. Please try again later.', 'error');
            } finally {
                setIsLoading(false);
            }
        }
    } else {
        setErrors(validationErrors);
    }
};


    return (
        <div className="login-page">
            <div className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="navbar-brand">
                        <img src="C:/Picture1.png" alt="E Channel" className="navbar-logo" />
                    </Link>
                    <div className="navbar-links">
                        <button onClick={() => navigate("/Register")} className="nav-btn1">Sign Up</button>
                        <button onClick={() => navigate("/Login")} className="nav-btn2">Login</button>
                    </div>
                </div>
            </div>
            <div className="login-container">
                <div className="left-section">
                    <div>
                        <h2>Welcome Back!</h2>
                    </div>
                    <div>
                        <p>Sign in to continue</p>
                    </div>
                </div>

                <div className="right-section">
                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="form-grid">
                            <div className="form-column">
                                <div className="input-group">
                                    <div className="login-info">
                                        <p className="para">Sign in</p>
                                        <p className="para1">Please enter your username and password to login</p>
                                    </div>
                                    <label>Username</label>
                                    <input
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        placeholder="Enter your username"
                                    />
                                    <span className={`error ${errors.username ? 'has-error' : ''}`}>
                                        {errors.username || 'No error'}
                                    </span>
                                </div>

                                <div className="input-group">
                                    <label>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Enter your password"
                                    />
                                    <span className={`error ${errors.password ? 'has-error' : ''}`}>
                                        {errors.password || 'No error'}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className='last'>
                            <button type="submit" className="submit-btn" disabled={isLoading}>
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                            <p className="signup-link">
                                Don't have an account? <Link to="/register" className='Reg'>Sign up here</Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
