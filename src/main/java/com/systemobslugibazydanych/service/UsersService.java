package com.systemobslugibazydanych.service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import com.systemobslugibazydanych.entity.Users;
import com.systemobslugibazydanych.entity.Role;
import com.systemobslugibazydanych.repository.UsersRepository;
import com.systemobslugibazydanych.repository.RoleRepository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManagerFactory;


@Service
public class UsersService {
	
	@Autowired
	private BCryptPasswordEncoder encoder;
	@Autowired
	private RoleRepository roleRepository;
	@Autowired
	private UsersRepository usersRepository;
	@Autowired
	private EntityManagerFactory entityManagerFactory;

	public int getIdOfCurrentUser(){
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		return usersRepository.findByEmail(authentication.getName()).getId();
	}

	public void saveUser(Users users) {
		users.setPassword(encoder.encode(users.getPassword()));
		Role customerRole = roleRepository.findByRole("CUSTOMER");
		users.setRoles(new HashSet<Role>(Arrays.asList(customerRole)));
		usersRepository.save(users);
	}

	public boolean isUserAlreadyPresent(Users users) {
		// Try to implement this method, as assignment.
		return false;
	}

	public List<Users> getAllUsers()
	{
		List<Users> result = usersRepository.findAll();
		return result;
	}

	public Users getUsersById(Integer id) throws RuntimeException
	{
		Optional<Users> users = usersRepository.findById(id);

		if(users.isPresent()) {
			return users.get();
		} else {
			throw new RuntimeException("No user record exist for given id");
		}
	}

	public Users createOrUpdateUsers(Users user)
	{
		if(user.getId()  == null)
		{
			user = usersRepository.save(user);

			return user;
		}
		else
		{
			Optional<Users> users = usersRepository.findById(user.getId());

			if(users.isPresent())
			{
				Users newEntity = users.get();
				newEntity.setEmail(user.getEmail());
				newEntity.setFirstName(user.getFirstName());
				newEntity.setLastName(user.getLastName());
				newEntity.setPassword(encoder.encode(user.getPassword()));

				newEntity = usersRepository.save(newEntity);

				return newEntity;
			} else {
				user = usersRepository.save(user);

				return user;
			}
		}
	}

	public void deleteUsersById(Integer id) throws RuntimeException
	{
		Optional<Users> users = usersRepository.findById(id);

		if(users.isPresent())
		{
			SessionFactory hibernateFactory = entityManagerFactory.unwrap(SessionFactory.class);

			Session session = hibernateFactory.openSession();
			String query = "DELETE FROM \"ALBERT\".\"USER_ROLE\" WHERE USER_ID = " + id;
			session.doWork(connection -> connection.prepareStatement(query).execute());
			session.close();

			usersRepository.deleteById(id);
		} else {
			throw new RuntimeException("No user record exist for given id");
		}
	}

}