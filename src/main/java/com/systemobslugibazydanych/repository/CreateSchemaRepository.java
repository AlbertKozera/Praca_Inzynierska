package com.systemobslugibazydanych.repository;

import com.systemobslugibazydanych.entity.DatabaseTable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CreateSchemaRepository extends JpaRepository<DatabaseTable, Integer> {


}
