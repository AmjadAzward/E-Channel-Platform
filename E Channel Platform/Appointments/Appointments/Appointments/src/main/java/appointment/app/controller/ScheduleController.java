package appointment.app.controller;

import appointment.app.entity.Schedule;
import appointment.app.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/schedules")
@CrossOrigin(origins = "http://localhost:3000")
// Adjust if your frontend runs on a different port
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    // Create a new schedule
    @PostMapping ("/save")
    public Schedule createSchedule(@RequestBody Schedule schedule) {
        return scheduleService.createSchedule(schedule);
    }

    // Get all schedules
    @GetMapping
    public List<Schedule> getAllSchedules() {
        return scheduleService.getAllSchedules();
    }

    // Get schedule by ID
    @GetMapping("/{id}")
    public Schedule getScheduleById(@PathVariable int id) {
        Optional<Schedule> schedule = scheduleService.getScheduleById(id);
        return schedule.orElse(null);
    }

    // Update an existing schedule
    @PutMapping("/{id}")
    public Schedule updateSchedule(@PathVariable int id, @RequestBody Schedule scheduleDetails) {
        return scheduleService.updateSchedule(id, scheduleDetails);
    }

    // Delete schedule by ID
    @DeleteMapping("/{id}")
    public void deleteSchedule(@PathVariable int id) {
        scheduleService.deleteSchedule(id);
    }




    @GetMapping(value = "/check-conflict", params = {"appointmentDate", "startTime", "endTime", "doctorId"})
    public ResponseEntity<Boolean> checkOverlap(
            @RequestParam LocalDate appointmentDate,
            @RequestParam LocalTime startTime,
            @RequestParam LocalTime endTime,
            @RequestParam int doctorId) {

        // Call service to check for overlap
        boolean isOverlapping = scheduleService.checkAppointmentConflict(appointmentDate, startTime, endTime, doctorId);

        // Return true if there is an overlap, false if there isn't
        return ResponseEntity.ok(isOverlapping);
    }

    @GetMapping("/dates/{id}")
    public List<LocalDate> getAppointments( @PathVariable int id) {
        return scheduleService.getAppointments(id);
    }

    @GetMapping("/times")
    public List<String> getAppointmentTimes( ) {
        return scheduleService.getAppointmentTimes();
    }

    @GetMapping("/dates-for-time/{date}/{id}")
    public List<String> getAppointmentTimesForDate(@PathVariable("date") String date, @PathVariable int id) {
        // Convert the date string to LocalDate
        LocalDate appointmentDate = LocalDate.parse(date);
        return scheduleService.getAppointmentTimesForDate(appointmentDate,id);
    }

    @GetMapping("/available")
    public List<Schedule> getAppointments() {
        return scheduleService.getAppointments();
    }

    @PutMapping("/book/{startTime}/{appointmentDate}/{doctorId}/{endTime}")
    public void bookAppointment(
            @PathVariable("startTime") LocalTime startTime,
            @PathVariable("appointmentDate") LocalDate appointmentDate,
            @PathVariable("doctorId") int doctorId,
            @PathVariable("endTime") LocalTime endTime) {
        scheduleService.bookAppointmentIfNotBooked(startTime, appointmentDate, doctorId, endTime);
    }


    @PutMapping("/Unbook/{startTime}/{appointmentDate}/{doctorId}/{endTime}")
    public void bookAppointmentNotBooked(
            @PathVariable("startTime") LocalTime startTime,
            @PathVariable("appointmentDate") LocalDate appointmentDate,
            @PathVariable("doctorId") int doctorId,
            @PathVariable("endTime") LocalTime endTime) {
        scheduleService.bookAppointmentIfBooked(startTime, appointmentDate, doctorId, endTime);
    }

}
