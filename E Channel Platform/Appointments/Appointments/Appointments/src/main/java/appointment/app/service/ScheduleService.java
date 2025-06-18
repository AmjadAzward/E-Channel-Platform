package appointment.app.service;

import appointment.app.entity.Schedule;
import appointment.app.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    // Create a new schedule
    public Schedule createSchedule(Schedule schedule) {
        return scheduleRepository.save(schedule);
    }

    // Read all schedules
    public List<Schedule> getAllSchedules() {
        return scheduleRepository.findAll();
    }

    // Read a schedule by ID
    public Optional<Schedule> getScheduleById(int id) {
        return scheduleRepository.findById(id);
    }

    // Update an existing schedule
    public Schedule updateSchedule(int id, Schedule scheduleDetails) {
        Optional<Schedule> existingSchedule = scheduleRepository.findById(id);

        if (existingSchedule.isPresent()) {
            Schedule schedule = existingSchedule.get();
            schedule.setDoctorId(scheduleDetails.getDoctorId());
            schedule.setDoctorName(scheduleDetails.getDoctorName());
            schedule.setAppointmentDate(scheduleDetails.getAppointmentDate());
            schedule.setStartTime(scheduleDetails.getStartTime());
            schedule.setEndTime(scheduleDetails.getEndTime());
            schedule.setStatus(scheduleDetails.getStatus());

            return scheduleRepository.save(schedule);
        }

        return null;  // Or throw an exception for "not found" case
    }

    // Delete a schedule by ID
    public boolean deleteSchedule(int id) {
        Optional<Schedule> existingSchedule = scheduleRepository.findById(id);

        if (existingSchedule.isPresent()) {
            scheduleRepository.delete(existingSchedule.get());
            return true;
        }

        return false;  // Or throw an exception for "not found" case
    }


    public boolean checkAppointmentConflict(LocalDate appointmentDate, LocalTime startTime, LocalTime endTime, int doctorId) {
        return scheduleRepository.existsByAppointmentDateAndTimeOverlap(appointmentDate, startTime, endTime, doctorId);
    }

    public List<LocalDate> getAppointments(int id) {
        return scheduleRepository.getAppointmentsForDic( id);
    }

    public List<String> getAppointmentTimes() {
        return scheduleRepository.getAppointmentTimes();
    }

    public List<String> getAppointmentTimesForDate(LocalDate date, int id) {
        return scheduleRepository.getAppointmentTimesForDates(date,id);
    }

    public List<Schedule> getAppointments() {
        return scheduleRepository.getAppointments();
    }



    public void bookAppointmentIfNotBooked(LocalTime startTime, LocalDate appointmentDate, int doctorId, LocalTime endTime) {
        scheduleRepository.bookAppointmentIfNotBooked(startTime, appointmentDate, doctorId, endTime);
    }

    public void bookAppointmentIfBooked(LocalTime startTime, LocalDate appointmentDate, int doctorId, LocalTime endTime) {
        scheduleRepository.bookAppointmentIfBooked(startTime, appointmentDate, doctorId, endTime);
    }



}