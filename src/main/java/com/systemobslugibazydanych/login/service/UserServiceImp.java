package com.systemobslugibazydanych.login.service;

import java.util.Arrays;
import java.util.HashSet;

import com.systemobslugibazydanych.login.model.Role;
import com.systemobslugibazydanych.login.model.User;
import com.systemobslugibazydanych.login.repository.RoleRepository;
import com.systemobslugibazydanych.login.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;



@Service
public class UserServiceImp implements UserService {
	
	@Autowired
	private BCryptPasswordEncoder encoder;
	@Autowired
	private RoleRepository roleRepository;
	@Autowired
	private UserRepository userRepository;

	@Override
	public void saveUser(User user) {
		user.setPassword(encoder.encode(user.getPassword()));
		user.setStatus("VERIFIED");
		Role userRole = roleRepository.findByRole("USER");
		user.setRoles(new HashSet<Role>(Arrays.asList(userRole)));
		userRepository.save(user);
	}

	@Override
	public boolean isUserAlreadyPresent(User user) {
		// Try to implement this method, as assignment.
		return false;
	}

}
