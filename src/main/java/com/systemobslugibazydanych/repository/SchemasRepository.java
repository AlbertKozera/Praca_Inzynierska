package com.systemobslugibazydanych.repository;

import com.systemobslugibazydanych.entity.Schemas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SchemasRepository extends JpaRepository<Schemas, Integer> {



}
