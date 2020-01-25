package com.systemobslugibazydanych.repository;

import com.systemobslugibazydanych.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CustomerRepository extends JpaRepository<User, Integer> {

    User findByEmail(String email);
}
