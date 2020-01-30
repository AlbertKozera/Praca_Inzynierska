package com.systemobslugibazydanych.repository;

import com.systemobslugibazydanych.entity.Schemas;
import com.systemobslugibazydanych.entity.Users;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

public class SchemasRepositoryImpl implements SchemasRepositoryCustom{

    @PersistenceContext
    private EntityManager entityManager;


    @Override
    public List<Schemas> findByUserId(Users usersFK) {
        return (entityManager.find(Users.class, usersFK.getId()).getSchemas());
    }
}
