package appointment.app.repository;

import appointment.app.entity.Appointment;
import appointment.app.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;


@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Integer> {
    // You can define custom query methods if needed


    @Query("SELECT COUNT(s) > 0 FROM Schedule s " +
            "WHERE s.appointmentDate = ?1 " +
            "AND s.startTime < ?3 " +
            "AND s.endTime > ?2 " +
            "AND s.doctorId = ?4")
    boolean existsByAppointmentDateAndTimeOverlap(
            LocalDate appointmentDate, LocalTime startTime, LocalTime endTime, int doctorId
    );




    @Query("SELECT a.appointmentDate FROM Schedule a WHERE a.doctorId = ?1 AND a.status = 'Not Booked'")
    public List<LocalDate> getAppointmentsForDic(int id);

    @Query("SELECT CONCAT(a.startTime, ' - ', a.endTime) FROM Schedule a WHERE a.status = 'Not Booked'")
    public List<String> getAppointmentTimes();

    @Query("SELECT CONCAT(a.startTime, ' - ', a.endTime) FROM Schedule a WHERE a.appointmentDate =?1 AND a.doctorId =?2 ")
    public List<String> getAppointmentTimesForDates(LocalDate appointmentDate, int doctorName);

    @Query("SELECT a FROM Schedule a WHERE a.status = 'Not Booked' AND a.appointmentDate >= CURRENT_DATE")
    List<Schedule> getAppointments();

    @Modifying
    @Transactional
    @Query("UPDATE Schedule s SET s.status = 'Booked' WHERE s.startTime = ?1 AND s.appointmentDate = ?2 AND s.doctorId = ?3 AND s.endTime = ?4  AND s.status = 'Not Booked'")
    public void bookAppointmentIfNotBooked(LocalTime startTime, LocalDate appointmentDate, int doctorId,LocalTime endTime );


    @Modifying
    @Transactional
    @Query("UPDATE Schedule s SET s.status = 'Not Booked' WHERE s.startTime = ?1 AND s.appointmentDate = ?2 AND s.doctorId = ?3 AND s.endTime = ?4  AND s.status = 'Booked'")
    public void bookAppointmentIfBooked(LocalTime startTime, LocalDate appointmentDate, int doctorId,LocalTime endTime );












}
