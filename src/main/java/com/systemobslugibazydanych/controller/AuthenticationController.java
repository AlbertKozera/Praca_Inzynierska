package com.systemobslugibazydanych.controller;

import javax.validation.Valid;

import com.systemobslugibazydanych.entity.Users;
import com.systemobslugibazydanych.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;



@Controller
public class AuthenticationController {

	@Autowired
	UsersService usersService;

	@GetMapping("/login")
	public String login() {
		return "/login";
	}

	@PostMapping(value= "/admin/adduser/add")
	public ModelAndView registerUser(@Valid Users users, BindingResult bindingResult, ModelMap modelMap) {
		ModelAndView modelAndView = new ModelAndView();
		// Check for the validations
		if(bindingResult.hasErrors()) {
			modelAndView.addObject("successMessage", "Formularz zawiera błędy!");
			modelMap.addAttribute("bindingResult", bindingResult);
		}
		else if(usersService.isUserAlreadyPresent(users)){
			modelAndView.addObject("successMessage", "Taki użytkownik już istnieje!");
		}
		// we will save the user if, no binding errors
		else {
			usersService.saveUser(users);
			modelAndView.addObject("successMessage", "Użytkownik został zarejestrowany pomyślnie!");
		}
		modelAndView.addObject("user", new Users());
		modelAndView.setViewName("/admin/adduser");
		return modelAndView;
	}
}










