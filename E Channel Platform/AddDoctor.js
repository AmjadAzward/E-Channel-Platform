// src/components/AddDoctor.js


import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddDoctor = () => {
    const [doctor, setDoctor] = useState({ name: "", specialization: "", contactNumber: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setDoctor({ ...doctor, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.post("http://localhost:8083/doc-details/doctors", doctor);
        navigate("/");
    };

    return (
        <div className="container mt-4">
            <h2>Add New Doctor</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Name</label>
                    <input type="text" className="form-control" name="name" value={doctor.name} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Specialization</label>
                    <input type="text" className="form-control" name="specialization" value={doctor.specialization} onChange={handleChange} required />
                </div>
                <div className="mb-3">
                    <label>Contact Number</label>
                    <input type="text" className="form-control" name="contactNumber" value={doctor.contactNumber} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn btn-success">✔ Save</button>
            </form>
        </div>
    );
};

export default AddDoctor;
