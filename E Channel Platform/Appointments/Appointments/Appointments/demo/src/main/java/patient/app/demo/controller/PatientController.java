package patient.app.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import patient.app.demo.entity.Patient;
import patient.app.demo.service.PatientService;

import java.util.List;

@RestController
public class PatientController {

    @Autowired
    private PatientService patientService;

    @GetMapping(path = "/patients")
    public List<Patient> getPatients(){
        return patientService.getPatients();
    }

    @GetMapping(path = "/patients/{id}")
    public Patient getPatientsById(@PathVariable int id){
        return patientService.getPatientById(id);
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

    @GetMapping(path = "/patients", params = "contactNumber")
    public List<Patient> findPatientByContactNumber(@RequestParam String contactNumber){
        return patientService.findPatientByContactNumber(contactNumber);
    }

}
