package com.systemobslugibazydanych.repository;

import com.systemobslugibazydanych.entity.Schemas;
import com.systemobslugibazydanych.entity.Users;
import org.springframework.stereotype.Repository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class UsersRepositoryImpl implements UsersRepositoryCustom {

    @PersistenceContext
    private EntityManager entityManager;


    @Override
    public List<Schemas> findByUserId(Users usersFK) {
        return (entityManager.find(Users.class, usersFK.getId()).getSchemas());
    }
}
