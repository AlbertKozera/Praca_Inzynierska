package com.systemobslugibazydanych.controller;
import com.systemobslugibazydanych.DTO.FeedbackDTO;
import com.systemobslugibazydanych.entity.Customer;
import com.systemobslugibazydanych.repository.SchemasRepository;
import com.systemobslugibazydanych.service.SchemasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.*;

@Controller
public class SchemasController {

    @Autowired
    private SchemasRepository schemasRepository;

    @Autowired
    SchemasService schemasService;

    @PostMapping(path = { "/user/executeSQL" })
    public ResponseEntity<Object> executeSQL(@RequestBody String sqlCode) {
        String[] split = sqlCode.replace("\n", "").replace("\t", "").replace("\r", "").split(";");
        schemasService.clearMapList();
        FeedbackDTO feedbackDTO = new FeedbackDTO(schemasService.executeSQL(split), schemasService.getMapList(), schemasService.isUpdateFlag());
        Map<String, FeedbackDTO> response = new HashMap<String, FeedbackDTO>();
        response.put("feedback", feedbackDTO);
        return new ResponseEntity<>( response , HttpStatus.OK);
    }

    @PostMapping(path = { "/user/dropUser" })
    public String dropUser(@RequestBody String userName) {
        schemasService.dropUser(userName);
        return "redirect:/user";
    }

    @PostMapping(path = { "/user/saveSchemaInDatabase" })
    public String saveSchemaInDatabase(@RequestBody String schemaName) {
        //databaseTableService.dropUser(userName);
        return "redirect:/user";
    }

    @GetMapping("/adduser")
    public String adduser(Model model) {
        Customer user = new Customer();
        model.addAttribute("user", user);
        return "/admin/adduser";
    }


}


