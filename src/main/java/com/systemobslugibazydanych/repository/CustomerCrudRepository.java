package com.systemobslugibazydanych.repository;

import com.systemobslugibazydanych.entity.Customer;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface CustomerCrudRepository extends CrudRepository<Customer, Integer> {

}
