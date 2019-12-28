package com.systemobslugibazydanych.service;


import com.systemobslugibazydanych.entity.Customer;

public interface CustomerService {

	public void saveCustomer(Customer customer);
	
	public boolean isCustomerAlreadyPresent(Customer customer);
}
