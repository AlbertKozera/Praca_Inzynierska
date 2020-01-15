package com.systemobslugibazydanych.controller;

import javax.validation.Valid;

import com.systemobslugibazydanych.entity.Customer;
import com.systemobslugibazydanych.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;



@Controller
public class AuthenticationController {

	@Autowired
	CustomerService customerService;

	@RequestMapping(value = { "/login" }, method = RequestMethod.GET)
	public ModelAndView login() {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("login.html"); // resources/templates/login.html
		return modelAndView;
	}

	@PostMapping(value="/admin/register")
	public String registerUser(Model model, Customer customer) {
		customerService.saveCustomer(customer);
		Customer user = new Customer();
		model.addAttribute("user", user);
		return "redirect:/admin";
	}
}










