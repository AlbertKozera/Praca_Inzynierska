package com.systemobslugibazydanych.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import javax.servlet.http.HttpServletRequest;

@Controller
public class StartController {

    @RequestMapping(value = "/")
    public String start(HttpServletRequest request){
        System.out.println(request.getServletPath());
        return "index";
    }
}
