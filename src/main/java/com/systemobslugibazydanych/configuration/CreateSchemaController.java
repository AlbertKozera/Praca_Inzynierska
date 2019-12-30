package com.systemobslugibazydanych.configuration;
import com.systemobslugibazydanych.entity.DatabaseTable;
import com.systemobslugibazydanych.repository.DatabaseTableRepository;
import com.systemobslugibazydanych.service.DatabaseTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class CreateSchemaController {

    @Autowired
    private DatabaseTableRepository databaseTableRepository;

    @Autowired
    DatabaseTableService databaseTableService;


    @PostMapping(path = { "/user/saveNameOfDatabase" })
    public String createSchema(@ModelAttribute("databaseTable") DatabaseTable databaseTable) {
        databaseTableService.nazwametody(databaseTable);
        return "redirect:/user";
    }


    @RequestMapping(path = { "/user" })
    public String showNewDatabase(Model model){
        DatabaseTable databaseTable = new DatabaseTable();
        model.addAttribute("databaseTable", databaseTable);
        return "/user/tworzenieBazy.html";
    }

    @RequestMapping(value = { "/DBDesign" }, method = RequestMethod.GET)
    public ModelAndView dbdesign() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("DBDesign.html"); // resources/templates/login.html
        return modelAndView;
    }

    @RequestMapping(value = { "/index" }, method = RequestMethod.GET)
    public ModelAndView index() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.setViewName("index.html"); // resources/templates/login.html
        return modelAndView;
    }
}


