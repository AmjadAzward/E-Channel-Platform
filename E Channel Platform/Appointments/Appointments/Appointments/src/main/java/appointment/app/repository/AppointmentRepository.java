package appointment.app.repository;

import appointment.app.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment,Integer> {

    @Query("select a from Appointment a where a.doctorName=?1")
    public List<Appointment> searchByDoctorName(String doctorName);

    @Query("select a from Appointment a where a.patientId=?1")
    public List<Appointment> searchByPatientId(int id);

    @Query("select a from Appointment a where a.doctorName=?1 and a.time=?2")
    public List<Appointment> searchByDoctorNameTime(String doctorName,String time);

    @Query("SELECT a FROM Appointment a WHERE a.date >= CURRENT_DATE")
    public List<Appointment> fetchByCurrentDate();
}
