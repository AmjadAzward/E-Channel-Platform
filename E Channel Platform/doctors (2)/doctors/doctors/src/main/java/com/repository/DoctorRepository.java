package com.repository;

import com.entity.DoctorEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<DoctorEntity, Long> {

    @Query("select d from DoctorEntity d where d.name = ?1")
    List<DoctorEntity> searchDoctorsByName(String name);



    @Query("select d.id from DoctorEntity d where d.name = ?1 AND d.specialization = ?2")
    Integer searchDoctorsId(String name,String specialization);


    @Query("SELECT d FROM DoctorEntity d WHERE d.name = ?1 AND d.specialization = ?2")
    List<DoctorEntity> searchDoctorsByNameAndSpecialization(String name, String specialization);

    @Query("SELECT d FROM DoctorEntity d WHERE d.specialization = ?1")
    List<DoctorEntity> searchDoctorsBySpecialization(String specialization);

    @Query("SELECT DISTINCT d.specialization FROM DoctorEntity d")
    List<String> findDistinctSpecializations();


    @Query("SELECT DISTINCT d.contactNumber FROM DoctorEntity d")
    List<String> findContacts();


    @Query("SELECT d.name FROM DoctorEntity d WHERE d.specialization = ?1")
    List<String> findDoctorNamesBySpecialization(String specialization);


    @Query("SELECT DISTINCT d.specialization FROM DoctorEntity d WHERE d.name = ?1")
    String findDoctorSpecializedCategory(String name);

    boolean existsByContactNumber(String contactNumber);

    @Query("SELECT d.id, d.name FROM DoctorEntity d WHERE d.contactNumber = ?1")
    List<Object[]> findDetailsByContact(String contactNumber);

    @Query("SELECT d.contactNumber FROM DoctorEntity d WHERE d.name = ?1")
    List<String> findContactByName(String name);


}
