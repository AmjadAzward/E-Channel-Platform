package patient.app.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import patient.app.demo.entity.Patient;
import patient.app.demo.service.PatientService;

import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:3000") // Allow React frontend

public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping(path = "/patients")
    public List<Patient> getPatients(){
        return patientService.getPatients();
    }

    @GetMapping(path = "/patients/ids/{id}")
    public Patient getPatientsById(@PathVariable int id){
        return patientService.getPatientById(id);
    }


    @GetMapping(path = "/patients/users/{username}")
    public Patient getPatientsByUser(@PathVariable String username){
        return patientService.getPatientByUsername(username);
    }



    @PostMapping(path = "/patients")
    public Patient createPatient(@RequestBody Patient patient){

        return patientService.createPatients(patient);
    }

    @DeleteMapping(path = "/patients/{id}")
    public Patient deletePatient(@PathVariable int id){

        return patientService.deletePatientById(id);
    }

    @PutMapping(path = "/patients/{id}")
    public Patient updatePatient(@PathVariable int id,@RequestBody Patient patient){
        return patientService.updatePatient(id,patient);
    }



    @GetMapping(path = "/patients/emails" , params = "email")
    public boolean checkEmailExists(@RequestParam String email) {
        return patientService.isEmailExists(email);
    }

    @GetMapping(path = "/patients/usernames" , params = "user")
    public boolean checkUserExists(@RequestParam String user) {
        return patientService.isUserNameExist(user);
    }

    @GetMapping(path = "/patients/passwords" , params = "password")
    public boolean isPasswordExist(@RequestParam String password) {
        return patientService.isPasswordExist(password);
    }

    @GetMapping(path = "/patients/contacts" , params = "contact")
    public boolean checkContactExists(@RequestParam String contact) {
        return patientService.isContactExist(contact);
    }

    @GetMapping(value = "/patients/logins", params = {"username", "password"})
    public String getUserName(@RequestParam String username, @RequestParam String password) {
        return patientService.getUserName(username, password);
    }


    @GetMapping("/id-by-contact/{contactNumber}")
    public ResponseEntity<Integer> getPatientIdByContact(@PathVariable String contactNumber) {
        Integer patientId = patientService.getPatientIdByContact(contactNumber);
        return ResponseEntity.ok(patientId);
    }

    @GetMapping("/contacts")
    public List<String> getContacts() {

        return patientService.getContacts();
    }

    @GetMapping("/details/{contactNumber}")
    public ResponseEntity<List<Map<String, Object>>> getPatientDetails(@PathVariable String contactNumber) {
        List<Map<String, Object>> details = patientService.getPatientDetailsByContact(contactNumber);
        return ResponseEntity.ok(details);
    }

    @GetMapping("/{username}/id")
    public Long getPatientId(@PathVariable String username) {
        return patientService.getPatientIdByUsername(username);
    }




}

