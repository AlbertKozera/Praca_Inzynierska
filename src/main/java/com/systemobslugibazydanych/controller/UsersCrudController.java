package com.systemobslugibazydanych.controller;

import java.util.List;
import java.util.Optional;

import com.systemobslugibazydanych.entity.Users;
import com.systemobslugibazydanych.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


@Controller
@RequestMapping("/")
public class UsersCrudController
{
    @Autowired
    UsersService service;

    @GetMapping(path = "/admin/users")
    public String getAllUsers(Model model)
    {
        List<Users> list = service.getAllUsers();

        model.addAttribute("users", list);
        return "/admin/users";
    }

    @GetMapping("/admin/adduser")
    public String adduser(Model model) {
        Users users = new Users();
        model.addAttribute("users", users);
        return "/admin/adduser";
    }

    @RequestMapping(path = {"/admin/edit", "/admin/edit/{id}"})
    public String editUsersById(Model model, @PathVariable("id") Optional<Integer> id)
            throws RuntimeException
    {
        if (id.isPresent()) {
            Users entity = service.getUsersById(id.get());
            model.addAttribute("users", entity);
        } else {
            model.addAttribute("users", new Users());
        }
        return "/admin/edituser";
    }

    @RequestMapping(path = "/admin/delete/{id}")
    public String deleteUsersById(Model model, @PathVariable("id") Integer id)
            throws RuntimeException
    {
        service.deleteUsersById(id);
        return "redirect:/admin/users";
    }

    @RequestMapping(path = "/admin/createUser", method = RequestMethod.POST)
    public String createOrUpdateUsers(Users users)
    {
        service.createOrUpdateUsers(users);
        return "redirect:/admin/users";
    }
}