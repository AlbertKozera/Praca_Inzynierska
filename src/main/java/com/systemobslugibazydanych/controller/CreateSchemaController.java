package com.systemobslugibazydanych.controller;
import com.systemobslugibazydanych.DTO.FeedbackDTO;
import com.systemobslugibazydanych.entity.Customer;
import com.systemobslugibazydanych.entity.DatabaseTable;
import com.systemobslugibazydanych.repository.DatabaseTableRepository;
import com.systemobslugibazydanych.service.DatabaseTableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.*;

@Controller
public class CreateSchemaController {

    @Autowired
    private DatabaseTableRepository databaseTableRepository;

    @Autowired
    DatabaseTableService databaseTableService;

    @PostMapping(path = { "/user/genereteSchema" })
    public ResponseEntity<Object> createSchema(@RequestBody String tmp) {
        String[] split = tmp.replace("\n", "").replace("\t", "").replace("\r", "").split(";");
        Map<String, ArrayList<String>> response = new HashMap<String, ArrayList<String>>();
        response.put("feedback", databaseTableService.executeSQL(split));
        return new ResponseEntity<>( response , HttpStatus.OK);
    }

    @PostMapping(path = { "/user/executeSQL" })
    public ResponseEntity<Object> executeSQL(@RequestBody String tmp) {
        String[] split = tmp.replace("\n", "").replace("\t", "").replace("\r", "").split(";");
        FeedbackDTO feedbackDTO = new FeedbackDTO(databaseTableService.executeSQL(split), databaseTableService.getMapList(), databaseTableService.isUpdateFlag());
        Map<String, FeedbackDTO> response = new HashMap<String, FeedbackDTO>();
        response.put("feedback", feedbackDTO);
        return new ResponseEntity<>( response , HttpStatus.OK);
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


