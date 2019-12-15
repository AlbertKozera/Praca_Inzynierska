package com.systemobslugibazydanych.configuration;
import com.systemobslugibazydanych.entity.DatabaseTable;
import com.systemobslugibazydanych.repository.CreateSchemaRepository;
import com.systemobslugibazydanych.service.CreateSchemaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class CreateSchemaController {

    @Autowired
    private CreateSchemaRepository createSchemaRepository;

    @Autowired
    CreateSchemaService createSchemaService;


    @PostMapping(path = { "/user/saveNameOfDatabase" })
    public String createSchema(@ModelAttribute("databaseTable") DatabaseTable databaseTable) {
        createSchemaService.nazwametody(databaseTable);
        return "redirect:/user";
    }


    @RequestMapping(path = { "/user" })
    public String showNewDatabase(Model model){
        DatabaseTable databaseTable = new DatabaseTable();
        model.addAttribute("databaseTable", databaseTable);
        return "/user/tworzenieBazy.html";
    }

}


