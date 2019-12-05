package com.systemobslugibazydanych.sqlcodecreator.repository;

import com.systemobslugibazydanych.sqlcodecreator.model.DatabaseTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CreateSchemaRepository extends JpaRepository<DatabaseTable, Integer> {

}
