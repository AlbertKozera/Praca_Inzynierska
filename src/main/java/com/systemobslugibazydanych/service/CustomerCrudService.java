package com.systemobslugibazydanych.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.systemobslugibazydanych.entity.Customer;
import com.systemobslugibazydanych.repository.CustomerCrudRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CustomerCrudService {

    @Autowired
    CustomerCrudRepository customerCrudRepository;

    public List<Customer> getAllEmployees()
    {
        List<Customer> result = (List<Customer>) customerCrudRepository.findAll();

        if(result.size() > 0) {
            return result;
        } else {
            return new ArrayList<Customer>();
        }
    }

    public Customer getEmployeeById(Integer id) throws RuntimeException
    {
        Optional<Customer> customer = customerCrudRepository.findById(id);

        if(customer.isPresent()) {
            return customer.get();
        } else {
            throw new RuntimeException("No customer record exist for given id");
        }
    }

    public Customer createOrUpdateEmployee(Customer entity)
    {
        if(entity.getId()  == null)
        {
            entity = customerCrudRepository.save(entity);

            return entity;
        }
        else
        {
            Optional<Customer> customer = customerCrudRepository.findById(entity.getId());

            if(customer.isPresent())
            {
                Customer newEntity = customer.get();
                newEntity.setEmail(entity.getEmail());
                newEntity.setName(entity.getName());
                newEntity.setLastName(entity.getLastName());

                newEntity = customerCrudRepository.save(newEntity);

                return newEntity;
            } else {
                entity = customerCrudRepository.save(entity);

                return entity;
            }
        }
    }

    public void deleteEmployeeById(Integer id) throws RuntimeException
    {
        Optional<Customer> customer = customerCrudRepository.findById(id);

        if(customer.isPresent())
        {
            customerCrudRepository.deleteById(id);
        } else {
            throw new RuntimeException("No customer record exist for given id");
        }
    }
}
