package com.systemobslugibazydanych.controller;

import java.util.List;
import java.util.Optional;

import com.systemobslugibazydanych.entity.Customer;
import com.systemobslugibazydanych.service.CustomerCrudService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


@Controller
@RequestMapping("/")
public class CustomerCrudController
{
    @Autowired
    CustomerCrudService service;

    @RequestMapping
    public String getAllEmployees(Model model)
    {
        List<Customer> list = service.getAllEmployees();

        model.addAttribute("employees", list);
        return "list-employees";
    }

    @RequestMapping(path = {"/edit", "/edit/{id}"})
    public String editEmployeeById(Model model, @PathVariable("id") Optional<Integer> id)
            throws RuntimeException
    {
        if (id.isPresent()) {
            Customer entity = service.getEmployeeById(id.get());
            model.addAttribute("employee", entity);
        } else {
            model.addAttribute("employee", new Customer());
        }
        return "add-edit-employee";
    }

    @RequestMapping(path = "/delete/{id}")
    public String deleteEmployeeById(Model model, @PathVariable("id") Integer id)
            throws RuntimeException
    {
        service.deleteEmployeeById(id);
        return "redirect:/";
    }

    @RequestMapping(path = "/createEmployee", method = RequestMethod.POST)
    public String createOrUpdateEmployee(Customer employee)
    {
        service.createOrUpdateEmployee(employee);
        return "redirect:/";
    }
}