package com.controller;

import com.service.DoctorService;
import com.entity.DoctorEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/doctors")
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend


public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public List<DoctorEntity> getDoctors() {
        return doctorService.getDoctors();
    }

    @GetMapping("/{id}")
    public DoctorEntity getDoctorById(@PathVariable Long id) {
        return doctorService.getDoctorById(id);
    }

    @PostMapping
    public DoctorEntity createDoctor(@RequestBody DoctorEntity doctor) {
        return doctorService.createDoctor(doctor);
    }

    @DeleteMapping("/{id}")
    public String deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctorById(id);
        return "Doctor with ID " + id + " deleted successfully";
    }

    @PutMapping("/{id}")
    public String updateDoctor(@PathVariable Long id, @RequestBody DoctorEntity doctor) {
        doctor.setId(id);
        doctorService.updateDoctor(id, doctor);
        return "Doctor with ID " + doctor.getId() + " updated successfully";
    }

    @GetMapping("/{id}/availability")
    public String getDoctorAvailability(@PathVariable Long id) {
        return doctorService.getDoctorAvailability(id);
    }

    @PostMapping("/{id}/schedule")
    public String scheduleAppointment(@PathVariable Long id, @RequestBody String appointmentDetails) {
        return doctorService.scheduleAppointment(id, appointmentDetails);
    }


    @GetMapping(params = {"name", "specialization"})
    public List<DoctorEntity> searchDoctors(
            @RequestParam String name,
            @RequestParam String specialization
    ) {
        return doctorService.searchDoctors(name, specialization);
    }

    @GetMapping(params = { "specialization"})
    public List<DoctorEntity> searchDoctorsSpecialization(
            @RequestParam String specialization
    ) {
        return doctorService.searchDoctorsSpecialization(specialization);
    }



    @GetMapping(params = { "docname"})
    public List<DoctorEntity> searchDoctorsByName(
            @RequestParam String docname
    ) {
        return doctorService.searchDoctorsByName(docname);
    }


    @GetMapping(value = "/search", params = {"name", "specialization"})
    public Integer getDoctorId(@RequestParam String name, @RequestParam String specialization) {
        return doctorService.getDoctorId(name, specialization);
    }


    @GetMapping(params = {"spec"})
    public List<String> findDoctorNamesOfCategory(@RequestParam String spec) {
        return doctorService.findDoctorNamesOfCategory(spec);
    }

    @GetMapping(params = {"name"})
    public List<String> getNos(@RequestParam String name) {
        return doctorService.getNos(name);
    }

    @GetMapping(params = {"doctorName"})
    public ResponseEntity<String> findDoctorSpecializedCategory(@RequestParam String doctorName) {
        if (doctorName == null || doctorName.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("Doctor name is required");
        }

        String specialization = doctorService.findDoctorSpecializedCategory(doctorName);
        if (specialization == null || specialization.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Specialization not found for doctor: " + doctorName);
        }

        return ResponseEntity.ok(specialization);
    }


    @GetMapping("/specializations")
    public List<String> getSpecializations() {

        return doctorService.getSpecializations();
    }


    @GetMapping("/contacts")
    public List<String> getContacts() {

        return doctorService.getContacts();
    }


    @GetMapping("/doctor-names")
    public List<String> getAllDoctorNames() {
        return doctorService.getAllDoctorNames();
    }


    @GetMapping(path = "/contacts" , params = "contact")
    public boolean checkContactExists(@RequestParam String contact) {

        return doctorService.isContactExist(contact);
    }


    @GetMapping("/details/{contactNumber}")
    public ResponseEntity<List<Map<String, Object>>> getDoctorDetails(@PathVariable String contactNumber) {
        List<Map<String, Object>> details = doctorService.getDoctorDetailsByContact(contactNumber);
        return ResponseEntity.ok(details);
    }
}
