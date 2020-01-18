package com.systemobslugibazydanych.controller;
import com.systemobslugibazydanych.entity.Customer;
import com.systemobslugibazydanych.entity.DatabaseTable;
import com.systemobslugibazydanych.repository.DatabaseTableRepository;
import com.systemobslugibazydanych.service.DatabaseTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class CreateSchemaController {

    @Autowired
    private DatabaseTableRepository databaseTableRepository;

    @Autowired
    DatabaseTableService databaseTableService;


    @PostMapping(path = { "/user/saveNameOfDatabase" })
    public String createSchema(@RequestBody String tmp) {
        String[] split = tmp.replace("\n", "").replace("\t", "").split(";");
        databaseTableService.nazwametody(split);

        return "redirect:/user";
    }

    @PostMapping(path = { "/user/executeSQL" })
    public String executeSQL(@RequestBody String tmp) {
        String[] split = tmp.replace("\n", "").replace("\t", "").split(";");
        databaseTableService.executeSQL(split);
        return "redirect:/user/interpreterSQL";
    }



    @RequestMapping(path = { "/user" })
    public String showNewDatabase(Model model){
        DatabaseTable databaseTable = new DatabaseTable();
        model.addAttribute("databaseTable", databaseTable);
        return "/index";
    }

    @RequestMapping(value = { "/index" }, method = RequestMethod.GET)
    public ModelAndView index() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("index.html"); // resources/templates/login.html
        return modelAndView;
    }

    @GetMapping("/adduser")
    public String adduser(Model model) {
        Customer user = new Customer();
        model.addAttribute("user", user);
        return "/admin/adduser";
    }

    @GetMapping("/drawdiagram")
    public String drawdiagram() {
        return "/user/drawdiagram";
    }

    @GetMapping("/interpreterSQL")
    public String interpreterSQL() {
        return "/user/interpreterSQL";
    }
}


