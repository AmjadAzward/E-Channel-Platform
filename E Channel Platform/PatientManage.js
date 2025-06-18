import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import Swal from 'sweetalert2';
import DoctorList from "./DoctorList"; // Import the DoctorList component
import Patient from "./Patient"
import ScheduleNav from "./schedulenav";

const Navbar = () => {
  const navigate = useNavigate();

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
        navigate("/");
      }
    });
  };

  return (
    <>
      <div>
        <nav className="bg-blue-600 p-4 text-white">
          <div className="navbar-container">
            <Link to="/AdminHome" className="navbar-brand">
              <img src="C:/Picture1.png" alt="E Channel" className="navbar-logo w-16" />
            </Link>

            <div className="ex">
              <div className="nav-buttons">
                <button onClick={() => navigate("/Navbar")} className="nav-btn">Manage</button>
                <button onClick={handleLogout} className="nav-btn">Logout</button>
              </div>
            </div>
          </div>

        </nav>
      </div>
      <div className="doctor-section">
      <Patient />
      </div>
      </>
      
  );
};

export default Navbar;