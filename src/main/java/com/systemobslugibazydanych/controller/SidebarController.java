package com.systemobslugibazydanych.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class SidebarController {

    @RequestMapping(path = {"/drawdiagram"}, method = RequestMethod.GET)
    public String drawdiagram(@ModelAttribute("schemaERD") String schemaERD, Model model) {
        model.addAttribute("schemaERD", schemaERD);
        return "/user/drawdiagram";
    }

    @GetMapping("/interpreterSQL")
    public String interpreterSQL() {
        return "/user/interpreterSQL";
    }

    @GetMapping("/index")
    public String index() {
        return "/index.html";
    }
}
