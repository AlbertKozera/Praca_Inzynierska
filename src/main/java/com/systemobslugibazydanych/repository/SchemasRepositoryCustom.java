package com.systemobslugibazydanych.repository;

import com.systemobslugibazydanych.entity.Schemas;
import com.systemobslugibazydanych.entity.Users;

import java.util.List;

public interface SchemasRepositoryCustom {
    List<Schemas> findByUserId(Users usersFK);
}
