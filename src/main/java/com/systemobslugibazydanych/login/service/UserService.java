package com.systemobslugibazydanych.login.service;


import com.systemobslugibazydanych.login.model.User;

public interface UserService {

	public void saveUser(User user);
	
	public boolean isUserAlreadyPresent(User user);
}
