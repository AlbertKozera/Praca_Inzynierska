package com.systemobslugibazydanych.controller;

import javax.validation.Valid;

import com.systemobslugibazydanych.entity.Customer;
import com.systemobslugibazydanych.service.CustomerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;



@Controller
public class AuthenticationController {

	@Autowired
	CustomerService customerService;

	@GetMapping("/login")
	public String login() {
		return "/login";
	}

	@PostMapping(value="/admin/register")
	public ModelAndView registerUser(@Valid Customer customer, BindingResult bindingResult, ModelMap modelMap) {
		ModelAndView modelAndView = new ModelAndView();
		// Check for the validations
		if(bindingResult.hasErrors()) {
			modelAndView.addObject("successMessage", "Formularz zawiera błędy!");
			modelMap.addAttribute("bindingResult", bindingResult);
		}
		else if(customerService.isCustomerAlreadyPresent(customer)){
			modelAndView.addObject("successMessage", "Taki użytkownik już istnieje!");
		}
		// we will save the user if, no binding errors
		else {
			customerService.saveCustomer(customer);
			modelAndView.addObject("successMessage", "Użytkownik został zarejestrowany pomyślnie!");
		}
		modelAndView.addObject("user", new Customer());
		modelAndView.setViewName("/admin/admin");
		return modelAndView;
	}
}










