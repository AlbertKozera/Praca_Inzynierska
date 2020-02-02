package com.systemobslugibazydanych.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class SidebarController {

    @GetMapping("/drawdiagram")
    public String drawdiagram() {
        return "/user/drawdiagram";
    }

    @RequestMapping(path = {"/editdiagram"}, method = RequestMethod.GET)
    public String editdiagram(@ModelAttribute("schemaERD") String schemaERD,@ModelAttribute("schemaName") String schemaName, Model model) {
        model.addAttribute("schemaERD", schemaERD);
        model.addAttribute("schemaName", schemaName);
        return "/user/editdiagram";
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
