package patient.app.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import patient.app.demo.entity.Patient;
import patient.app.demo.repository.PatientRepository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PatientService {

    @Autowired
    private PatientRepository patientRepository;


    public List<Patient> getPatients(){
        return patientRepository.findAll();
    }

    public Patient getPatientById(int id){
        Optional<Patient> pat = patientRepository.findById(id);
        if(pat.isPresent()){
            return pat.get();
        }
        return null;
    }


    public List<String> getContacts() {

        return patientRepository.findAllContacts();
    }

    public Patient getPatientByUsername(String username){
        Patient user = patientRepository.findByUsername(username);
        if (user != null) {
            return user;
        }
        return null; // Return false if user not found
    }


    public Patient createPatients(Patient patient){
        return patientRepository.save(patient);
    }

    public Patient deletePatientById(int id){
        Optional<Patient> pat = patientRepository.findById(id);
        if (pat.isPresent()){
            patientRepository.deleteById(id);
            return pat.get();
        }
        return null;
    }
    public Patient updatePatient(int id, Patient patient) {
        Optional<Patient> pat = patientRepository.findById(id);
        if (pat.isPresent()) {
            Patient existingPat = pat.get();
            existingPat.setName(patient.getName());
            existingPat.setAge(patient.getAge());
            existingPat.setGender(patient.getGender()); // Update gender
            existingPat.setContactNumber(patient.getContactNumber()); // Update contact
            existingPat.setUsername(patient.getUsername()); // Update username
            existingPat.setEmail(patient.getEmail()); // Update email
            existingPat.setPassword(patient.getPassword()); // Update password
            patientRepository.save(existingPat); // Save the updated entity
            return existingPat;
        }
        return null; // Return null if patient not found
    }


    public boolean isEmailExists(String email) {
        return patientRepository.existsByEmail(email);
    }

    // Method to check if a username exists
    public boolean isUserNameExist(String userName) {
        return patientRepository.existsByUsername(userName);
    }

    // Method to check if a password exists (not recommended for real applications)
    public boolean isPasswordExist(String password) {
        return patientRepository.existsByPassword(password);
    }


    public boolean isContactExist(String contactNumber) {
        return patientRepository.existsByContactNumber(contactNumber);
    }

    public String getUserName(String username, String password) {
        Patient user = patientRepository.findByUsernameAndPassword(username, password);
        if (user != null) {
            return user.getName();
        }
        return "false"; // Return false if user not found
    }


    public Integer getPatientIdByContact(String contactNumber) {
        Integer patientId = patientRepository.findIdByContactNumber(contactNumber);
        return (patientId != null) ? patientId : 0;
    }

    public List<Map<String, Object>> getPatientDetailsByContact(String contactNumber) {
        List<Object[]> results = patientRepository.findPatientDetailsByContact(contactNumber);

        return results.stream().map(obj -> {
            Map<String, Object> map = new HashMap<>();
            map.put("id", obj[0]);
            map.put("name", obj[1]);
            return map;
        }).collect(Collectors.toList());
    }


    public Long getPatientIdByUsername(String username) {
        return patientRepository.findPatientIdByUsername(username);
    }


}


