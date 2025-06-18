package patient.app.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import patient.app.demo.entity.Patient;
import patient.app.demo.repository.PatientRepository;

import java.util.List;
import java.util.Optional;

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
    public Patient updatePatient(int id,Patient patient){
        Optional<Patient> pat = patientRepository.findById(id);
        if(pat.isPresent()){
            Patient existingPat = pat.get();
            existingPat.setName(patient.getName());
            existingPat.setAge(patient.getAge());
            patientRepository.save(existingPat);
            return existingPat;
        }
        return patient;
    }

    public List<Patient> findPatientByContactNumber(String contactNumber){
        return patientRepository.findPatientByContactNumber(contactNumber);
    }
}
