package com.systemobslugibazydanych.controller;
import com.systemobslugibazydanych.dto.SaveSchemaInDatabaseDTO;
import com.systemobslugibazydanych.dto.FeedbackDTO;
import com.systemobslugibazydanych.entity.Schemas;
import com.systemobslugibazydanych.service.SchemasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@Controller
public class SchemasController {

    @Autowired
    SchemasService schemasService;

    @PostMapping(path = {"/customer/executeSQL"})
    public ResponseEntity<Object> executeSQL(@RequestBody String sqlCode) {
        String[] split = sqlCode.replace("\n", "").replace("\t", "").replace("\r", "").split(";");
        schemasService.clearMapList();
        FeedbackDTO feedbackDTO = new FeedbackDTO(schemasService.executeSQL(split), schemasService.getMapList(), schemasService.isUpdateFlag());
        Map<String, FeedbackDTO> response = new HashMap<String, FeedbackDTO>();
        response.put("feedback", feedbackDTO);
        return new ResponseEntity<>( response , HttpStatus.OK);
    }

    @PostMapping(path = {"/customer/saveSchemaInDatabase"})
    public String saveSchemaInDatabase(@RequestBody SaveSchemaInDatabaseDTO saveSchemaInDatabaseDto) {
        schemasService.saveSchemaInDatabase(saveSchemaInDatabaseDto);
        return "redirect:/user";
    }

    @GetMapping(path = "/customer/schemasManagement")
    public String getAllSchemasForCurrentUser(Model model)
    {
        List<Schemas> list = schemasService.getAllSchemasForCurrentUser();
        model.addAttribute("schemas", list);

        return "/customer/schemasManagement";
    }

    @RequestMapping(path = {"/customer/editdiagram"}, method = RequestMethod.GET)
    public String editdiagram(@ModelAttribute("id") Integer id, Model model) {
        String schemaERD = schemasService.editUser(id);
        String schemaName = schemasService.returnNameById(id);
        model.addAttribute("schemaERD", schemaERD);
        model.addAttribute("schemaName", schemaName);
        return "/customer/editdiagram";
    }

    @RequestMapping(path = "/customer/deleteSchema/{id}")
    public String deleteSchemaById(@PathVariable("id") Integer id)
    {
        schemasService.dropUserById(id);
        return "redirect:/customer/schemasManagement";
    }

    @PostMapping(path = {"/customer/dropUser"})
    public String dropUser(@RequestBody String username) {
        schemasService.dropUserByUsername(username);
        return "redirect:/customer/drawdiagram";
    }
}


