package com.systemobslugibazydanych.service;


import com.systemobslugibazydanych.entity.User;

public interface UserService {

	public void saveUser(User user);
	
	public boolean isUserAlreadyPresent(User user);
}
