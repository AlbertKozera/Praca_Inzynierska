package com.systemobslugibazydanych.service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import com.systemobslugibazydanych.entity.Customer;
import com.systemobslugibazydanych.entity.Role;
import com.systemobslugibazydanych.repository.CustomerRepository;
import com.systemobslugibazydanych.repository.RoleRepository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;



@Service
public class CustomerService {
	
	@Autowired
	private BCryptPasswordEncoder encoder;
	@Autowired
	private RoleRepository roleRepository;
	@Autowired
	private CustomerRepository customerRepository;
	@Autowired
	private SomeService someService;


	public void saveCustomer(Customer customer) {
		customer.setPassword(encoder.encode(customer.getPassword()));
		customer.setStatus("VERIFIED");
		Role customerRole = roleRepository.findByRole("USER");
		customer.setRoles(new HashSet<Role>(Arrays.asList(customerRole)));
		customerRepository.save(customer);
	}


	public boolean isCustomerAlreadyPresent(Customer customer) {
		// Try to implement this method, as assignment.
		return false;
	}










	public List<Customer> getAllEmployees()
	{
		List<Customer> result = customerRepository.findAll();
		return result;
	}

	public Customer getEmployeeById(Integer id) throws RuntimeException
	{
		Optional<Customer> customer = customerRepository.findById(id);

		if(customer.isPresent()) {
			return customer.get();
		} else {
			throw new RuntimeException("No customer record exist for given id");
		}
	}

	public Customer createOrUpdateEmployee(Customer entity)
	{
		if(entity.getId()  == null)
		{
			entity = customerRepository.save(entity);

			return entity;
		}
		else
		{
			Optional<Customer> customer = customerRepository.findById(entity.getId());

			if(customer.isPresent())
			{
				Customer newEntity = customer.get();
				newEntity.setEmail(entity.getEmail());
				newEntity.setName(entity.getName());
				newEntity.setLastName(entity.getLastName());

				newEntity = customerRepository.save(newEntity);

				return newEntity;
			} else {
				entity = customerRepository.save(entity);

				return entity;
			}
		}
	}

	public void deleteEmployeeById(Integer id) throws RuntimeException
	{
		Optional<Customer> customer = customerRepository.findById(id);

		if(customer.isPresent())
		{
			SessionFactory hibernateFactory = someService.getHibernateFactory();
			Session session = hibernateFactory.openSession();
			String query = "DELETE FROM \"ALBERT\".\"USER_ROLE\" WHERE USER_ID = " + id;
			session.doWork(connection -> connection.prepareStatement(query).execute());
			session.close();

			customerRepository.deleteById(id);
		} else {
			throw new RuntimeException("No customer record exist for given id");
		}
	}

}
