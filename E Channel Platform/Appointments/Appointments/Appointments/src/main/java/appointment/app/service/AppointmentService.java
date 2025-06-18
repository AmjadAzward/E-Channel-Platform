package appointment.app.service;

import appointment.app.entity.Appointment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.stereotype.Service;
import appointment.app.repository.AppointmentRepository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    public List<Appointment> getAppointments(){
        return appointmentRepository.findAll();
    }

    public Appointment getAppointmentById(int id){
        Optional<Appointment> appoin = appointmentRepository.findById(id);
        if(appoin.isPresent()){
            return appoin.get();
        }
        return null;
    }

    public List<Appointment> getAppointmentsByPatientId(int patientId) {
        return appointmentRepository.searchByPatientId(patientId);
    }

    public Appointment createAppointment(Appointment appointment){
        return appointmentRepository.save(appointment);
    }

    public Appointment updateAppointment(int id, Appointment appointment){
        Optional<Appointment> appoin = appointmentRepository.findById(id);
        if(appoin.isPresent()){
            Appointment existingAppointment = appoin.get();
            existingAppointment.setPatientId(appointment.getPatientId());
            existingAppointment.setDoctorId(appointment.getDoctorId());
            existingAppointment.setPatientName(appointment.getPatientName());
            existingAppointment.setDoctorName(appointment.getDoctorName());
            existingAppointment.setDate(appointment.getDate());
            existingAppointment.setTime(appointment.getTime());
            appointmentRepository.save(existingAppointment);
            return existingAppointment;
        }
        return appointment;
    }

    public List<Appointment> searchByDoctorName(String doctorName){
        return appointmentRepository.searchByDoctorName(doctorName);
    }

    public List<Appointment> searchByDoctorNameTime(String doctorName,String time){
        return appointmentRepository.searchByDoctorNameTime(doctorName,time);
    }

    public List<Appointment> getUpcomingAppointments() {
        return appointmentRepository.fetchByCurrentDate();
    }

}
