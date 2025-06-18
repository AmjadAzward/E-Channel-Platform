// src/components/EditDoctor.js


import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const EditDoctor = () => {
    const { id } = useParams();
    const [doctor, setDoctor] = useState({ name: "", specialization: "", contactNumber: "" });
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`http://localhost:8083/doc-details/doctors/${id}`)
            .then(response => setDoctor(response.data))
            .catch(error => console.error(error));
    }, [id]);

    const handleChange = (e) => {
        setDoctor({ ...doctor, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await axios.put(`http://localhost:8083/doc-details/doctors/${id}`, doctor);
        navigate("/");
    };

    return (
        <div className="container mt-4">
            <h2>Edit Doctor</h2>
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
                <button type="submit" className="btn btn-warning">✔ Update</button>
            </form>
        </div>
    );
};

export default EditDoctor;
