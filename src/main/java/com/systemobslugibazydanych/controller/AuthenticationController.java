package com.systemobslugibazydanych.controller;

import javax.validation.Valid;

import com.systemobslugibazydanych.entity.Customer;
import com.systemobslugibazydanych.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
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

	@RequestMapping(value = "/register", method = RequestMethod.GET)
	public ModelAndView register() {
		ModelAndView modelAndView = new ModelAndView();
		Customer user = new Customer();
		modelAndView.addObject("user", user);
		modelAndView.setViewName("register.html"); // resources/templates/register.html
		return modelAndView;
	}

	@RequestMapping(value = "/admin/Admin", method = RequestMethod.GET)
	public ModelAndView adminHome() {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("admin/admin.html"); // resources/templates/admin/Admin.html
		return modelAndView;
	}

	@RequestMapping(value="/register", method=RequestMethod.POST)
	public ModelAndView registerUser(@Valid Customer customer, BindingResult bindingResult, ModelMap modelMap) {
		ModelAndView modelAndView = new ModelAndView();
		// Check for the validations
		if(bindingResult.hasErrors()) {
			modelAndView.addObject("successMessage", "Please correct the errors in form!");
			modelMap.addAttribute("bindingResult", bindingResult);
		}
		else if(customerService.isCustomerAlreadyPresent(customer)){
			modelAndView.addObject("successMessage", "user already exists!");			
		}
		// we will save the user if, no binding errors
		else {
			customerService.saveCustomer(customer);
			modelAndView.addObject("successMessage", "User is registered successfully!");
		}
		modelAndView.addObject("user", new Customer());
		modelAndView.setViewName("register");
		return modelAndView;
	}
}










