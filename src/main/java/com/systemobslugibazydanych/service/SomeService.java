package com.systemobslugibazydanych.service;

import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManagerFactory;

@Component
public class SomeService {

    private SessionFactory hibernateFactory;

    @Autowired
    public SomeService(EntityManagerFactory entityManagerFactory) {
        if (entityManagerFactory.unwrap(SessionFactory.class) == null) {
            throw new NullPointerException("Entity Manager Factory is not a hibernate factory");
        }
        this.hibernateFactory = entityManagerFactory.unwrap(SessionFactory.class);
    }

    public SessionFactory getHibernateFactory() {
        return hibernateFactory;
    }
}