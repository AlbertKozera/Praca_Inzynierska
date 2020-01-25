package com.systemobslugibazydanych.controller;

import java.util.List;
import java.util.Optional;

import com.systemobslugibazydanych.entity.User;
import com.systemobslugibazydanych.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


@Controller
@RequestMapping("/")
public class CustomerCrudController
{
    @Autowired
    CustomerService service;

    @GetMapping(path = "/users")
    public String getAllEmployees(Model model)
    {
        List<User> list = service.getAllEmployees();

        model.addAttribute("customers", list);
        return "/admin/users";
    }

    @RequestMapping(path = {"/edit", "/edit/{id}"})
    public String editEmployeeById(Model model, @PathVariable("id") Optional<Integer> id)
            throws RuntimeException
    {
        if (id.isPresent()) {
            User entity = service.getEmployeeById(id.get());
            model.addAttribute("customer", entity);
        } else {
            model.addAttribute("customer", new User());
        }
        return "/admin/edituser";
    }

    @RequestMapping(path = "/delete/{id}")
    public String deleteEmployeeById(Model model, @PathVariable("id") Integer id)
            throws RuntimeException
    {
        service.deleteEmployeeById(id);
        return "redirect:/users";
    }

    @RequestMapping(path = "/createEmployee", method = RequestMethod.POST)
    public String createOrUpdateEmployee(User employee)
    {
        service.createOrUpdateEmployee(employee);
        return "redirect:/users";
    }
}