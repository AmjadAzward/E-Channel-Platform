package patient.app.demo.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import patient.app.demo.entity.Patient;

import java.util.List;

@Repository
public interface PatientRepository extends JpaRepository<Patient,Integer> {

    @Query("SELECT p.id FROM Patient p WHERE p.contactNumber = ?1")
    Integer findIdByContactNumber (String contactNumber);

    @Query("SELECT p FROM Patient p WHERE p.username = ?1")

    Patient findByUsername(String username);


    @Query("SELECT p.id FROM Patient p WHERE p.username = ?1")
    Long findPatientIdByUsername(String username);


    boolean existsByEmail(String email);

    // Check if username exists
    boolean existsByUsername(String username);

    // Check if password exists
    boolean existsByPassword(String password);

    boolean existsByContactNumber(String contactNumber);

    Patient findByUsernameAndPassword(String username, String password);


    @Query("SELECT p.contactNumber FROM Patient p")
    List<String> findAllContacts();

    @Query("SELECT p.id, p.name FROM Patient p WHERE p.contactNumber = ?1")
    List<Object[]> findPatientDetailsByContact(String contactNumber);






}
