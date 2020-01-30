package com.systemobslugibazydanych.controller;
import com.systemobslugibazydanych.dto.SaveSchemaInDatabaseDTO;
import com.systemobslugibazydanych.dto.FeedbackDTO;
import com.systemobslugibazydanych.entity.Schemas;
import com.systemobslugibazydanych.entity.Users;
import com.systemobslugibazydanych.service.SchemasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.*;

@Controller
public class SchemasController {

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

    @PostMapping(path = { "/user/saveSchemaInDatabase" })
    public String saveSchemaInDatabase(@RequestBody SaveSchemaInDatabaseDTO saveSchemaInDatabaseDto) {
        schemasService.saveSchemaInDatabase(saveSchemaInDatabaseDto);
        return "redirect:/user";
    }

    @GetMapping(path = "/schemasManagement")
    public String getAllSchemasForCurrentUser(Model model)
    {
        List<Schemas> list = schemasService.getAllSchemasForCurrentUser();
        model.addAttribute("schemas", list);

        return "/user/schemasManagement";
    }

    @RequestMapping(path = "/editSchema/{id}")
    public String editSchemaById(@PathVariable("id") Integer id, RedirectAttributes redirectAttributes){
        String schemaERD = schemasService.editUser(id);
        redirectAttributes.addAttribute("schemaERD", schemaERD);
        return "redirect:/drawdiagram";
    }

    @RequestMapping(path = "/deleteSchema/{id}")
    public String deleteSchemaById(@PathVariable("id") Integer id)
    {
        schemasService.dropUser(id);
        return "redirect:/schemasManagement";
    }

    @GetMapping("/adduser")
    public String adduser(Model model) {
        Users users = new Users();
        model.addAttribute("users", users);
        return "/admin/adduser";
    }

}


