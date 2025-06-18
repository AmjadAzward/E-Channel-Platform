import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ViewDoctor.css";
import Swal from "sweetalert2";

const FetchDoctorsFromCategory = () => {
    const [doctors, setDoctors] = useState([]);
    const [categories, setCategories] = useState([]);
    const [doctorNames, setDoctorNames] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedDoctor, setSelectedDoctor] = useState("");

    useEffect(() => {
        fetchCategories();
        fetchDoctors();
    }, []);

    useEffect(() => {
        fetchDoctors(selectedCategory, selectedDoctor);
        if (selectedCategory) {
            fetchDoctorNames(selectedCategory); // Fetch relevant doctor names
        } else {
            fetchDoctorNames(); // Fetch all doctor names
        }
    }, [selectedCategory, selectedDoctor]);






    // Fetch categories (specializations) or auto-select the specialization if a doctor name is selected
const fetchCategories = async (doctorName = "") => {
    try {
        let url = "http://localhost:8083/doc-details/doctors/specializations";


        const response = await axios.get(url);
        
        if (doctorName && response.data.length === 1) {
            setSelectedCategory(response.data[0]); // Auto-set specialization if only one result
        } else {
            setCategories(response.data); // Populate category dropdown normally
        }

    } catch (error) {
        console.error("Error fetching categories:", error);
    }
};


const handleClick = () => {
    Swal.fire("Login to book Appointments");
};

// Fetch doctor names (filtered by specialization if selected)
const fetchDoctorNames = async (category = "") => {
    try {
        const baseUrl = "http://localhost:8083/doc-details/doctors"; // Base URL
        let url = baseUrl;

        // Append query parameters based on the category value
        if (category) {
            url += `?spec=${category}`;  // If category is provided
        } else {
            url += "/doctor-names";  
        }

        const response = await axios.get(url);
        setDoctorNames(response.data);
    } catch (error) {
        console.error("Error fetching doctor names:", error);
    }
};



    // Fetch doctors based on category (specialization) and/or name
    const fetchDoctors = async (category = "", name = "") => {
        try {
            let url = "http://localhost:8083/doc-details/doctors";

            if (category && name) {
                url += `?name=${name}&specialization=${category}`; // Updated name parameter
            } else if (category) {
                url += `?specialization=${category}`;
            } else if (name) {
                url += `?docname=${name}`; // Updated name parameter
            }

            const response = await axios.get(url);
            setDoctors(response.data);
        } catch (error) {
            console.error("Error fetching doctors:", error);
        }
    };


    return (
        <div className="container mt-4">
            <h2 className="text-center">Find a Doctor</h2>

            {/* Search Filters */}
            <div className="row mb-3">
                {/* Specialization Dropdown */}
                <div className="col-md-6">
                    <select
                        className="form-select"
                        onChange={(e) => {
                            setSelectedCategory(e.target.value);
                            setSelectedDoctor(""); // Reset doctor selection when specialization changes
                        }}
                        value={selectedCategory}
                    >
                        <option value="">-- Select Specialization --</option>
                        {categories.map((category) => (
                            <option key={category} value={category}>
                                {category}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Doctor Name Dropdown */}
                <div className="col-md-6">
                    <select
                        className="form-select"
                        onChange={(e) => setSelectedDoctor(e.target.value)}
                        value={selectedDoctor}
                    >
                        <option value="">-- Select Doctor --</option>
                        {doctorNames.length > 0 ? (
                            doctorNames.map((name, index) => (
                                <option key={index} value={name}>
                                    {name}
                                </option>
                            ))
                        ) : (
                            <option disabled>Loading...</option>
                        )}
                    </select>
                </div>
            </div>

            {/* Display doctors */}
            <div className="row">
                {doctors.map((doctor) => (
                    <div key={doctor.id} className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h5 className="card-title">{doctor.name}</h5>
                                <h6 className="card-subtitle mb-2 text-muted">{doctor.specialization}</h6>
                                <p className="card-text">Contact: {doctor.contactNumber}</p>
                                <button className="btn btn-primary" onClick={handleClick}>Book Appointment</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FetchDoctorsFromCategory;
