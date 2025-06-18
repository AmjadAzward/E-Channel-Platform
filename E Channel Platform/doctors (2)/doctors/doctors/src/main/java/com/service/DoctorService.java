package com.service;

import com.repository.DoctorRepository;
import com.entity.DoctorEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public List<DoctorEntity> getDoctors() {
        return doctorRepository.findAll();
    }

    public DoctorEntity getDoctorById(Long id) {
        Optional<DoctorEntity> doctor = doctorRepository.findById(id);
        return doctor.orElse(null);
    }

    public DoctorEntity createDoctor(DoctorEntity doctor) {
        return doctorRepository.save(doctor);
    }

    public void deleteDoctorById(Long id) {
        doctorRepository.deleteById(id);
    }

    public DoctorEntity updateDoctor(Long id, DoctorEntity doctor) {
        Optional<DoctorEntity> existingDoctor = doctorRepository.findById(id);
        if (existingDoctor.isPresent()) {
            DoctorEntity updatedDoctor = existingDoctor.get();
            updatedDoctor.setName(doctor.getName());
            updatedDoctor.setSpecialization(doctor.getSpecialization());
            updatedDoctor.setContactNumber(doctor.getContactNumber());
            return doctorRepository.save(updatedDoctor);
        }
        return null;
    }

    public String getDoctorAvailability(Long doctorId) {
        DoctorEntity doctor = doctorRepository.findById(doctorId).orElse(null);
        if (doctor == null) {
            return "Doctor with ID " + doctorId + " not found.";
        }
        return "Doctor with ID " + doctorId + " is available from 9:00 AM to 5:00 PM.";
    }

    public String scheduleAppointment(Long doctorId, String appointmentDetails) {
        DoctorEntity doctor = doctorRepository.findById(doctorId).orElse(null);
        if (doctor == null) {
            return "Doctor with ID " + doctorId + " not found.";
        }

        return "Appointment scheduled for Doctor with ID " + doctorId + ": " + appointmentDetails;
    }

    public List<DoctorEntity> searchDoctors(String name, String specialization) {
        return doctorRepository.searchDoctorsByNameAndSpecialization(name, specialization);
    }

    public List<DoctorEntity> searchDoctorsByName(String name) {
        return doctorRepository.searchDoctorsByName(name);
    }

    public Integer getDoctorId(String name, String specialization) {
        return doctorRepository.searchDoctorsId(name, specialization);
    }

    public List<DoctorEntity> searchDoctorsSpecialization(String specialization) {
        return doctorRepository.searchDoctorsBySpecialization(specialization);
    }

    public List<String> getSpecializations() {

        return doctorRepository.findDistinctSpecializations();
    }

    public List<String> getNos(String name) {

        return doctorRepository.findContactByName(name);
    }



    public List<String> getContacts() {

        return doctorRepository.findContacts();
    }

    public List<String> findDoctorNamesOfCategory(String specialization) {
        return doctorRepository.findDoctorNamesBySpecialization(specialization);
    }

    public String findDoctorSpecializedCategory(String name) {
        String specialization = doctorRepository.findDoctorSpecializedCategory(name);
        System.out.println("Found specialization: " + specialization); // Debugging
        return specialization;
    }


    public List<String> getAllDoctorNames() {
        List<DoctorEntity> doctors = doctorRepository.findAll();
        List<String> doctorNames = new ArrayList<>();
        for (DoctorEntity doctor : doctors) {
            doctorNames.add(doctor.getName());
        }
        return doctorNames;
    }

    public boolean isContactExist(String contactNumber) {
        return doctorRepository.existsByContactNumber(contactNumber);
    }

    public List<Map<String, Object>> getDoctorDetailsByContact(String contactNumber) {
        List<Object[]> results = doctorRepository.findDetailsByContact(contactNumber);

        // Transform Object[] into Map with appropriate labels
        return results.stream().map(result -> {
            Map<String, Object> doctorDetails = new HashMap<>();
            doctorDetails.put("id", result[0]);
            doctorDetails.put("name", result[1]);
            return doctorDetails;
        }).collect(Collectors.toList());
    }


}
