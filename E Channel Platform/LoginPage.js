import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorList from "./DoctorList"; // Import the DoctorList component
import ViewDoctor from "./ViewDoctor"; // Import the ViewDoctor component
import Swal from 'sweetalert2'; 

import "./LoginPage.css";

const LoginPage = () => {
    const navigate = useNavigate();

    // List of images and corresponding quotes
    const slides = [
        {
            image: "url(https://media.istockphoto.com/id/1319031310/photo/doctor-writing-a-medical-prescription.jpg?s=612x612&w=0&k=20&c=DWZGM8lBb5Bun7cbxhKT1ruVxRC_itvFzA9jxgoA0N8=)",
            quote: "Your health is our priority."
        },
        {
            image: "url(https://media.istockphoto.com/id/1460099874/photo/nurse-checking-on-a-patient.jpg?s=612x612&w=0&k=20&c=Nc1xxXBioaZDooQynLqPAcSAI5TPtBPd89D5XfwTCy0=)",
            quote: "Quality care for every patient."
        },
        {
            image: "url('https://www.shutterstock.com/image-illustration/top-view-medical-stethoscope-icon-260nw-2075382679.jpg')",
            quote: "Trust, care, and excellence in healthcare."
        }
    ];

    
    const [currentSlide, setCurrentSlide] = useState(0);

    // Auto slide change every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleSelectChange = (e) => {
        const selectedValue = e.target.value;

        // Navigate based on selected option
        if (selectedValue === "doctor1") {
            Swal.fire("Login to get this feature");
            e.target.value="";

        } else if (selectedValue === "doctor2") {
            Swal.fire("Login to get this feature");
            e.target.value="";

        }
    };

    return (
        <div className="main-container">
            {/* Navbar with Logo, Search Bar, and Buttons */}
            <div className="top-section" style={{ backgroundImage: slides[currentSlide].image }}>
                <nav className="navbar">
                    <h2 className="logo">APELLO</h2>
                    <select className="search-bar" onChange={handleSelectChange}>
                        <option value="">What are you searching for....</option>
                        <option value="doctor1">Book your appointments</option>
                        <option value="doctor2">Check doctor availability</option>
                        {/* Add more doctors or options as needed */}
                    </select>
                    <div className="nav-buttons">
                        <button onClick={() => navigate("/Register")} className="nav-btn">Sign Up</button>
                        <button onClick={() => navigate("/login")} className="nav-btn">Login</button>
                    </div>
                </nav>

                <div className="quote-container">
                    <h2 className="abc">{slides[currentSlide].quote}</h2>
                </div>
            </div>

            {/* Static Content */}
            <div className="bottom-section">
                <h2>Discover the best healthcare services</h2>
                <p>We provide comprehensive medical solutions for your well-being.</p>
            </div>

            {/* Doctor List Section */}
            <div className="doctor-section">
                <ViewDoctor />
            </div>
        </div>
    );
};

export default LoginPage;
