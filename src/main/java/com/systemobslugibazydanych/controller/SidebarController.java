package com.systemobslugibazydanych.controller;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class SidebarController {

    @GetMapping("/drawdiagram")
    public String drawdiagram() {
        return "/user/drawdiagram";
    }

    @RequestMapping(path = "/editSchema/{id}")
    public String editSchemaById(@PathVariable("id") Integer id, RedirectAttributes redirectAttributes){
        redirectAttributes.addAttribute("id", id);
        return "redirect:/editdiagram";
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
