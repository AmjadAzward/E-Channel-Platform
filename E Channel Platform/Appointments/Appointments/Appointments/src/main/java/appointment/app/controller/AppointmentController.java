package appointment.app.controller;

import appointment.app.entity.Appointment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import appointment.app.service.AppointmentService;

import java.util.List;
@CrossOrigin(origins = "http://localhost:3000")
@RestController
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping(path = "/appointments")
    public List<Appointment> getAppointments(){
        return appointmentService.getAppointments();
    }

    @GetMapping(path = "/appointments/{id}")
    public Appointment getAppointmentById(@PathVariable int id){
        return appointmentService.getAppointmentById(id);
    }

    @PostMapping(path = "/appointments")
    public Appointment createAppointment (@RequestBody Appointment appointment){
        return appointmentService.createAppointment(appointment);
    }

    @PutMapping(path = "/appointments/{id}")
    public Appointment updateAppointment(@PathVariable int id, @RequestBody Appointment appointment){
        return appointmentService.updateAppointment(id,appointment);
    }

    @GetMapping(path = "/appointments", params="doctorName")
    public List<Appointment> searchByDoctorName(@RequestParam String doctorName){
        return appointmentService.searchByDoctorName(doctorName);
    }



    @GetMapping("/appointments/patient/{id}")
    public List<Appointment> getAppointmentsByPatientId(@PathVariable int id) {
        return appointmentService.getAppointmentsByPatientId(id);
    }




    @GetMapping(path = "/appointments",params = {"doctorName","time"})
    public List<Appointment> searchByDoctorNameTime(@RequestParam String doctorName, @RequestParam String time){
        return appointmentService.searchByDoctorNameTime(doctorName,time);
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Appointment>> getUpcomingAppointments() {
        List<Appointment> appointments = appointmentService.getUpcomingAppointments();
        return ResponseEntity.ok(appointments);
    }

}
