package patient.app.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import patient.app.demo.entity.Patient;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient,Integer> {

    @Query("select p from Patient p where p.name=?1")
    public List<Patient> findPatientByContactNumber(String contactNumber);
}
