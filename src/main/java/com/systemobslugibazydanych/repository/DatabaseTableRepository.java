package com.systemobslugibazydanych.repository;

import com.systemobslugibazydanych.entity.DatabaseTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DatabaseTableRepository extends JpaRepository<DatabaseTable, Integer> {


}
