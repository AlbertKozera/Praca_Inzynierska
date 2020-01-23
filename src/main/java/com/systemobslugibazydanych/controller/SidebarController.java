package com.systemobslugibazydanych.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SidebarController {

    @GetMapping("/drawdiagram")
    public String drawdiagram() {
        return "/user/drawdiagram";
    }

    @GetMapping("/interpreterSQL")
    public String interpreterSQL() {
        return "/user/interpreterSQL";
    }

}
