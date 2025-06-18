<div className="edit-form">

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
            <label>Doctor Id</label>


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
                onChange={fetchDoctorId}

                value={editingAppointment.doctorId}
                className="form-control"

                readOnly
              />
            </div>

            <label>Appointment date</label>

            {/* Appointment Date */}
            <select
              name="appointmentDate"
              value={editingAppointment.appointmentDate}
              onChange={handleDateChange1}
            >
              <option value="">Select Date</option>
              {dates.map((date, index) => (
                <option key={index} value={date}>
                  {date}
                </option>
              ))}
            </select>

            <label>Appointment Time</label>

            {/* Appointment Time */}
            <select
              name="appointmentTime"
              value={editingAppointment.appointmentTime}
              onChange={handleInputChange}
            >
              <option value="">Select Time Slot</option>
              {availableTimes.map((time, index) => (
                <option key={index} value={time}>
                  {time}
                </option>
              ))}
            </select>

            {/* Error Message */}
            {errorMessage && <p className="errormsg">{errorMessage}</p>}

            {/* Buttons */}
            <div className="d-flex justify-content-between">
              <button className="btn btn-success" onClick={handleUpdateAppointment}>Save</button>
              <button className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
            </div>

          </div>