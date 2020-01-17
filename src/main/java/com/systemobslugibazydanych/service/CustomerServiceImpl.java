package com.systemobslugibazydanych.service;

import java.util.Arrays;
import java.util.HashSet;

import com.systemobslugibazydanych.entity.Customer;
import com.systemobslugibazydanych.entity.Role;
import com.systemobslugibazydanych.repository.CustomerRepository;
import com.systemobslugibazydanych.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;



@Service
public class CustomerServiceImpl implements CustomerService {
	
	@Autowired
	private BCryptPasswordEncoder encoder;
	@Autowired
	private RoleRepository roleRepository;
	@Autowired
	private CustomerRepository customerRepository;

	@Override
	public void saveCustomer(Customer customer) {
		customer.setPassword(encoder.encode(customer.getPassword()));
		customer.setStatus("VERIFIED");
		Role customerRole = roleRepository.findByRole("USER");
		customer.setRoles(new HashSet<Role>(Arrays.asList(customerRole)));
		customerRepository.save(customer);
	}

	@Override
	public boolean isCustomerAlreadyPresent(Customer customer) {
		// Try to implement this method, as assignment.
		return false;
	}








}
