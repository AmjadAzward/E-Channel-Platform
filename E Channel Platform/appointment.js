import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { Link } from "react-router-dom";


const ScheduleList = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [contact, setdocContacts] = useState([]);

  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    patientName: "",
    doctorId: "",
    doctorName: "",
    appointmentDate: "",
    appointmentTime: ""
  });


  const [editAppointment, seteditAppointment] = useState({
    patientId: "",
    patientName: "",
    doctorId: "",
    doctorName: "",
    appointmentDate: "",
    appointmentTime: ""



  });


  const [errorMessage, setErrorMessage] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  // States for specializations
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("");

  useEffect(() => {
    fetchAppointments();
    fetchDoctorsnames();
    fetchDocContacts();
    fetchPatients();
    fetchDates();
    fetchContacts();
    fetchSpecializations(); // Fetch specializations when the component is mounted
  }, []);

  // Fetch Appointments
  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:8085/appointment-details/appointments");
      setAppointments(response.data);
    } catch (error) {
      console.error("Error fetching appointments", error);
    }
  };

  // Fetch Doctors (Initial)
  const fetchDoctorsnames = async () => {
    try {
      const response = await axios.get("http://localhost:8083/doc-details/doctors/doctor-names");
      setDoctors(response.data);
    } catch (error) {
      console.error("Error fetching doctors", error);
    }
  };

  const fetchDocContacts = async () => {
    try {
      const response = await axios.get("http://localhost:8083/doc-details/doctors/contacts");
      setdocContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts", error);
    }
  };

  // Fetch Specializations
  const fetchSpecializations = async () => {
    try {
      const response = await axios.get("http://localhost:8083/doc-details/doctors/specializations");
      setSpecializations(response.data);
    } catch (error) {
      console.error("Error fetching specializations", error);
    }
  };

  // Fetch Patients
  const fetchPatients = async () => {
    try {
      const response = await axios.get("http://localhost:8084/admin/patients");
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients", error);
    }
  };

  // Fetch Contacts
  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:8084/patient-details/contacts");
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts", error);
    }
  };

  // Handle Input Change for form fields
  const handleInputChange = async (e) => {
    const { name, value } = e.target;

    if (name === "patientContact") {
      if (!value.trim()) {
        // Clear patient details and reset dates if input is empty
        setNewAppointment((prev) => ({
          ...prev,
          patientContact: "",
          patientId: "",
          patientName: "",
        }));
        setDates([]); // Clear dates
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8084/patient-details/details/${value}`);
        const patientData = response.data.length > 0 ? response.data[0] : null;

        if (patientData) {
          setNewAppointment((prev) => ({
            ...prev,
            patientContact: value,
            patientId: patientData.id || "",
            patientName: patientData.name || "",
          }));

          // Fetch available appointment dates using the patient ID


        } else {
          console.warn("No patient data found.");
          setDates([]); // Clear dates if no patient found
        }
      } catch (error) {
        console.error("Error fetching patient details", error);
        setDates([]); // Clear dates on error
      }
    } else {
      setNewAppointment((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };



  // Fetch available dates for the appointments
  const [dates, setDates] = useState([]);

  const handleFetchDates = () => {
    if (editingAppointment.doctorId !== null) {
      const doctorId = editingAppointment.doctorId;
      console.log(doctorId);

      if (doctorId) {
        fetchDates(doctorId);
      }
    }

  };


  const fetchDates = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8085/appointment-details/schedules/dates/${id}`);
      setDates(response.data);
    } catch (error) {
      console.error("Error fetching appointment dates:", error);
    }
  };

  const [datess, setDatess] = useState([]);


  const fetchDates1 = async () => {
    try {
      const response = await axios.get(`http://localhost:8085/appointment-details/schedules/dates/${editingAppointment.doctorId}`);
      setDatess(response.data);
    } catch (error) {
      console.error("Error fetching appointment dates:", error);
    }
  };





  // Fetch available times for a specific date


  // Fetch dates when the component mounts


  // Handle date change and fetch corresponding times
  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setNewAppointment((prev) => ({
      ...prev,
      appointmentDate: selectedDate,
    }));
    fetchTimesForDate(selectedDate); // Fetch times when a date is selected
  };

  const handleInputsChange = async (e) => {
    const { name, value } = e.target;

    if (name === "doctorName") {
      setNewAppointment((prev) => ({
        ...prev,
        doctorName: value,
      }));

      try {
        const response = await axios.get(`http://localhost:8083/doc-details/doctors/search?name=${value}&specialization=${selectedSpecialization}`);
        if (response.data) {
          setNewAppointment((prev) => ({
            ...prev,
            doctorId: response.data,
          }));
          fetchDates(response.data);
        }
      } catch (error) {
        console.error("Error fetching doctor ID", error);
      }
    } else {
      setNewAppointment((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };






  const [formSubmitted, setFormSubmitted] = useState(false);

  const addNewAppointment = async () => {
    setFormSubmitted(true); // Mark form as submitted when user clicks submit
  
    if (
      !newAppointment.appointmentDate ||
      !newAppointment.appointmentTime ||
      !newAppointment.doctorId ||
      !newAppointment.doctorName ||
      !newAppointment.patientId ||
      !newAppointment.patientName
    ) {
      setErrorMessage("All fields are required!");
      return; // Stop execution if any field is missing
    }
  
    try {
      const appointmentRequestBody = {
        date: newAppointment.appointmentDate,
        time: newAppointment.appointmentTime,
        doctorId: newAppointment.doctorId,
        doctorName: newAppointment.doctorName,
        patientId: newAppointment.patientId,
        patientName: newAppointment.patientName
      };
  
      // First API request to add the appointment
      const response = await axios.post("http://localhost:8085/appointment-details/appointments", appointmentRequestBody);
      console.log("Response from server:", response);
  
      const [startTime, endTime] = newAppointment.appointmentTime.split(" - ");
      console.log("Start Time:", startTime);
      console.log("End Time:", endTime);
  
      // Perform the second API request to book the schedule
      const scheduleRequestBody = {
        startTime: startTime,
        endTime: endTime,
        appointmentDate: newAppointment.appointmentDate,
        doctorId: newAppointment.doctorId
      };
  
      // Modify this URL according to your required parameters
      const scheduleResponse = await axios.put(
        `http://localhost:8085/appointment-details/schedules/book/${startTime}/${newAppointment.appointmentDate}/${newAppointment.doctorId}/${endTime}`
      );
      console.log("Schedule Response from server:", scheduleResponse);
  
      // Reset form fields and error state
      setNewAppointment({
        patientId: "",
        patientName: "",
        doctorId: "",
        doctorName: "",
        appointmentDate: "",
        appointmentTime: ""
      });
  
      setFormSubmitted(false); // Reset form submission tracking
      setShowAddForm(false);
      fetchAppointments();
      Swal.fire("Appointment Added Successfully", "", "success");
  
    } catch (error) {
      console.error("Error occurred while adding appointment:", error);
      setErrorMessage("Failed to add appointment. Please try again.");
    }
  };
  




  const handleSpecializationsChange = async (e) => {
    const specialization = e.target.value;
    setSelectedSpecialization(specialization);

    if (specialization) {
      try {
        const response = await axios.get(`http://localhost:8083/doc-details/doctors?spec=${specialization}`);
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors for specialization", error);
      }
    } else {
      setDoctors([]);
    }
  };

  const [availableTimes, setAvailableTimes] = useState([]);

  // Handle Date Change and Fetch Available Time
  const handleDateChange1 = async (e) => {
    const selectedDate = e.target.value;

    // Set the selected date
    setNewAppointment((prev) => ({
      ...prev,
      appointmentDate: selectedDate,
    }));

    // Fetch available times for the selected date and doctor
    if (selectedDate && newAppointment.doctorId) {
      try {
        const response = await axios.get(`http://localhost:8085/appointment-details/schedules/dates-for-time/${selectedDate}/${newAppointment.doctorId}`);
        setAvailableTimes(response.data);  // Update available times based on the selected date and doctor
      } catch (error) {
        console.error("Error fetching available times:", error);
      }
    } else {
      setAvailableTimes([]); // Reset times if no date or doctor is selected
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle sidebar visibility
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // For sidebar toggle













  const [editingAppointment, setEditingAppointment] = useState(null);
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    if (isEditFormOpen && editingAppointment?.doctorId) {
      fetchDates(editingAppointment.doctorId);
    }
  }, [isEditFormOpen, editingAppointment?.doctorId]);

  // Inside handleInputsChange
  const handleInputssChange = (e) => {
    const { name, value } = e.target;
    console.log(`Changing field: ${name} with value: ${value}`);  // Debugging log
    setEditingAppointment((prevState) => ({
      ...prevState,
      [name]: value,  // Update the corresponding field in the state
    }));
  };
  const handleEditClick = (appointment) => {
    setEditingAppointment(appointment);
    setIsEditFormOpen(true);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingAppointment((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updateAppointment = async () => {
    try {
      await axios.put(
        `http://localhost:8085/appointment-details/appointments/${editingAppointment.id}`,
        editingAppointment
      );
      Swal.fire("Appointment Updated Successfully", "", "success");
      setIsEditFormOpen(false);
      fetchAppointments();
    } catch (error) {
      console.error("Error updating appointment:", error);
      Swal.fire("Failed to update appointment!", "", "error");
    }
  };



  const handleEdit = (appointment) => {
    setEditingAppointment(appointment);
    setIsEditFormOpen(true);
  };


  const handleUpdate = () => {
    updateAppointment(editingAppointment);
    setIsEditFormOpen(false);
    setEditingAppointment(null);
  };


  const fetchDoctorId = async (doctorId) => {
    try {
      editAppointment((prevState) => ({
        ...prevState,
        doctorId: doctorId,  // Update doctorName in the form state
      }));

      console.log("Fetching doctor ID with parameters:");
      console.log("Doctor Name:", doctorId);



      // Ensure that you are passing the specialization properly
      const response = await axios.get(`http://localhost:8085/appointment-details/schedules/dates/${doctorId}`);


      if (response.data) {
        console.log("Response:", response.data);

        const doctorId = response.data;
        updateAppointment((prevState) => ({
          ...prevState,
          doctorId: doctorId,
        }));

        document.getElementById("docId").value = doctorId;

        console.log("Doctor ID:", doctorId);

        // Update the state with the new schedule
        handleUpdateAppointment((prevState) => ({
          ...prevState,
          doctorId// Save the doctorId to state
        }));
      }
    } catch (error) {
      console.error("Error fetching doctor ID:", error);
    }
  };



  const handleUpdateAppointment = async () => {
    try {
      await axios.put(
        `http://localhost:8085/appointment-details/appointments/${editingAppointment.id}`,
        editingAppointment
      );
      Swal.fire("Appointment Updated Successfully", "", "success");
      setIsEditFormOpen(false);  // Close the edit form after successful update
      setEditingAppointment(null);  // Reset the editing state
      fetchAppointments();  // Refresh the appointments list
    } catch (error) {
      console.error("Error updating appointment:", error);
      Swal.fire("Failed to update appointment!", "", "error");
    }
  };




  const [times, setTimes] = useState([]);
  const fetchTimesForDate = async (date, id) => {
    console.log("fetchTimesForDate called with:", { date, id });

    if (!id || !date) {
      console.error("Doctor ID or Date is missing!", { id, date });
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8085/appointment-details/schedules/dates-for-time/${date}/${id}`);
      setTimes(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching appointment times:", error);
    }
  };

  


  useEffect(() => {
    if (
      isEditFormOpen &&
      editingAppointment?.appointmentDate &&
      editingAppointment?.doctorId !== undefined
    ) {
      console.log("Calling fetchTimesForDate with:", {
        date: editingAppointment.appointmentDate,
        id: editingAppointment.doctorId
      });

      fetchTimesForDate(editingAppointment.appointmentDate, editingAppointment.doctorId);
    }
  }, [isEditFormOpen, editingAppointment?.appointmentDate, editingAppointment?.doctorId]); // Ensure doctorId updates trigger effect


  useEffect(() => {
    if (
      showAddForm &&
      newAppointment?.appointmentDate &&
      newAppointment?.doctorId !== undefined
    ) {
      console.log("Calling fetchTimesForDate with:", {
        date: newAppointment.appointmentDate,
        id: newAppointment.doctorId
      });

      fetchTimesForDate(newAppointment.appointmentDate, newAppointment.doctorId);
    }
  }, [showAddForm, newAppointment?.appointmentDate, newAppointment?.doctorId]); // Ensure doctorId updates trigger effect

  return (
    <div>
      {/* Sidebar Toggle Button */}
      <span className="sidebar-toggle-btn" onClick={toggleSidebar}>
        &#9776; {/* Hamburger Menu Icon */}
      </span>

      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <button className="close-sidebar-btn" onClick={toggleSidebar}>
          &times;
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
        <h2 className="text">Appointment Management</h2>

        <button className="btn btn-success mb-4" onClick={() => setShowAddForm(!showAddForm)}>
          {showAddForm ? "Cancel" : "Add Appointment"}
        </button>

        {showAddForm && (
          <div className="appointment-form">
            <h3>Add New Appointment</h3>

            {/* Patient Contact */}
            <select name="patientContact" value={newAppointment.patientContact} onChange={handleInputChange}>
              <option value="">Select Patient Contact</option>
              {contacts.map((contact) => (
                <option key={contact} value={contact}>{contact}</option>
              ))}
            </select>

            {/* Patient Details */}
            <div className="mb-3">
              <input type="text" name="patientId" placeholder="Patient ID" value={newAppointment.patientId} className="form-control" readOnly />
            </div>
            <div className="mb-3">
              <input type="text" name="patientName" placeholder="Patient Name" value={newAppointment.patientName} className="form-control" readOnly />
            </div>

            <select name="doctorSpecialization" value={selectedSpecialization} onChange={handleSpecializationsChange}>
              <option value="">Select Specialization</option>
              {specializations.map((specialization, index) => (
                <option key={index} value={specialization}>{specialization}</option>
              ))}
            </select>

            <select name="doctorName" value={newAppointment.doctorName} onChange={handleInputsChange}>
              <option value="">Select Doctor</option>
              {doctors.map((doctor, index) => (
                <option key={index} value={doctor}>{doctor}</option>
              ))}
            </select>

            <div className="mb-3">
              <input
                type="text"
                name="doctorId"
                placeholder="Doctor ID"
                value={newAppointment.doctorId}
                className="form-control"
                readOnly
              />
            </div>


            {/* Appointment Date */}
            <select
              name="appointmentDate"
              value={newAppointment.appointmentDate}
              onChange={handleInputsChange}
              className="form-control"
            >
              <option value="">Select Date</option>
              {dates.length > 0 ? (
                dates.map((date, index) => (
                  <option key={index} value={date}>
                    {date}
                  </option>
                ))
              ) : (
                <option disabled>No available dates</option>
              )}
            </select>


            <select name="appointmentTime" value={newAppointment.appointmentTime} onChange={handleInputChange}>
              <option value="">Select Time Slot</option>
              {times.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>


            {errorMessage && <p className="errormsg">{errorMessage}</p>}

            <div className="d-flex justify-content-between">
              <button className="btn btn-success" onClick={addNewAppointment}>Save</button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setNewAppointment({ appointmentDate: "", doctorId: "", patientId: "" }); // Reset fields
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}


        {/* Schedule Table */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient Name</th>
              <th>Doctor Name</th>

              <th>Appointment Date</th>
              <th>Appointment Time</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment.id}>
                  <td>{appointment.id}</td>
                  <td>{appointment.patientName}</td>
                  <td>{appointment.doctorName}</td>

                  <td>{appointment.date}</td>
                  <td>{appointment.time}</td>
                  <td>
                    <button
                      className="btn btn-warning btn-sm"
                      onClick={() => handleEdit(appointment)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(appointment.id)}

                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">No appointments available</td>
              </tr>
            )}
          </tbody>
        </table>


        {isEditFormOpen && (
          <div className="appointment-form">
            <h3>Add New Appointment</h3>


            <label>Patient Id</label>
            {/* Patient Details */}
            <div className="mb-3">
              <input
                type="text"
                name="patientId"
                placeholder="Patient ID"
                value={editingAppointment.patientId}
                className="form-control"
                readOnly
              />
            </div>
            <label>Patient Name</label>

            <div className="mb-3">
              <input
                type="text"
                name="patientName"
                placeholder="Patient Name"
                value={editingAppointment.patientName}
                className="form-control"
                onChange={handleInputChange}
                readOnly
              />
            </div>

            <label>Doctor Name</label>


            {/* Doctor Name */}
            <div className="mb-3">
              <input
                type="text"
                name="doctorName"
                placeholder="Doctor Name"
                value={editingAppointment.doctorName}
                onChange={handleInputsChange}
                className="form-control"
              />
            </div>
            <label>Doctor Id</label>

            {/* Patient Details */}
            <div className="mb-3">
              <input
                type="text"
                name="doctorId"
                placeholder="Doctor ID"
                id="docId"
                onChange={handleInputsChange

                }

                value={editingAppointment.doctorId}
                className="form-control"

                readOnly
              />
            </div>



            {/* Appointment Date */}
            {/* Appointment Date */}
            <label>Appointment Date</label>
            <select
              name="appointmentDate"
              value={editingAppointment.appointmentDate || ''}  // Ensure that we select the correct date
              onChange={(e) => {
                handleInputssChange(e); // Update state when date is changed
                fetchTimesForDate(e.target.value); // Fetch times for the selected date
                fetchDates1();
              }}
              className="form-control"
            >
              <option value="">Select Date</option>
              {dates.length > 0 ? (
                dates.map((date, index) => (
                  <option key={index} value={date}>
                    {date}
                  </option>
                ))
              ) : (
                <option disabled>No available dates</option>
              )}
            </select>

            <label>Appointment Time</label>


            <select name="appointmentTime" value={editingAppointment.appointmentTime} onChange={handleInputChange}>
              <option value="">Select Time Slot</option>
              {times.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>


            {errorMessage && <p className="errormsg">{errorMessage}</p>}

            <div className="d-flex justify-content-between">
              <button className="btn btn-success" onClick={updateAppointment}>Update</button>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setShowAddForm(false);
                  setIsEditFormOpen(false); // Close edit form
                  setNewAppointment({ appointmentDate: "", doctorId: "", patientId: "" }); // Clear fields
                  setEditingAppointment(null); // Reset editing state
                }}
              >
                Cancel
              </button>
            </div>
          </div>

        )}




      </div>
    </div>
  );
};

export default ScheduleList;
