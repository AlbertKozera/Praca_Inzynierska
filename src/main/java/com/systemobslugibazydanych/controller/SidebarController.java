package com.systemobslugibazydanych.controller;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.util.Collection;

@Controller
public class SidebarController {

    @GetMapping("/customer/drawdiagram")
    public String drawdiagram() {
        return "/customer/drawdiagram";
    }

    @RequestMapping(path = "/customer/editSchema/{id}")
    public String editSchemaById(@PathVariable("id") Integer id, RedirectAttributes redirectAttributes){
        redirectAttributes.addAttribute("id", id);
        return "redirect:/customer/editdiagram";
    }

    @GetMapping("/customer/interpreterSQL")
    public String interpreterSQL() {
        return "/customer/interpreterSQL";
    }

    @GetMapping("/index")
    public String index() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        boolean admin = authentication.getAuthorities().stream().anyMatch(r -> r.getAuthority().equals("ADMIN"));
        boolean customer = authentication.getAuthorities().stream().anyMatch(r -> r.getAuthority().equals("CUSTOMER"));

        if(customer)
            return "/customer/drawdiagram.html";
        else if(admin)
            return "/admin/users.html";
        else
            return "/index.html";
    }

    @GetMapping("/")
    public String startPage() {
        return "redirect:/index";
    }
}
