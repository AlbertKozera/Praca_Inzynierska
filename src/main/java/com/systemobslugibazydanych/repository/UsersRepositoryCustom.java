package com.systemobslugibazydanych.repository;

import com.systemobslugibazydanych.entity.Schemas;
import com.systemobslugibazydanych.entity.Users;

import java.util.List;

public interface UsersRepositoryCustom  {
    List<Schemas> findByUserId(Users usersFK);
}
