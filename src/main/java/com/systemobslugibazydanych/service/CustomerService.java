package com.systemobslugibazydanych.service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import com.systemobslugibazydanych.entity.Users;
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


	public void saveCustomer(Users users) {
		users.setPassword(encoder.encode(users.getPassword()));
		users.setStatus("VERIFIED");
		Role customerRole = roleRepository.findByRole("USER");
		users.setRoles(new HashSet<Role>(Arrays.asList(customerRole)));
		customerRepository.save(users);
	}


	public boolean isCustomerAlreadyPresent(Users users) {
		// Try to implement this method, as assignment.
		return false;
	}










	public List<Users> getAllEmployees()
	{
		List<Users> result = customerRepository.findAll();
		return result;
	}

	public Users getEmployeeById(Integer id) throws RuntimeException
	{
		Optional<Users> customer = customerRepository.findById(id);

		if(customer.isPresent()) {
			return customer.get();
		} else {
			throw new RuntimeException("No customer record exist for given id");
		}
	}

	public Users createOrUpdateEmployee(Users entity)
	{
		if(entity.getId()  == null)
		{
			entity = customerRepository.save(entity);

			return entity;
		}
		else
		{
			Optional<Users> customer = customerRepository.findById(entity.getId());

			if(customer.isPresent())
			{
				Users newEntity = customer.get();
				newEntity.setEmail(entity.getEmail());
				newEntity.setFirstName(entity.getFirstName());
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
		Optional<Users> customer = customerRepository.findById(id);

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
