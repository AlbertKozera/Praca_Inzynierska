package com.systemobslugibazydanych.login.repository;

import com.systemobslugibazydanych.login.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

}
