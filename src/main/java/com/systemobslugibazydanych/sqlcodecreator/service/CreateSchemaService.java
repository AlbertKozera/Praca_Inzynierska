package com.systemobslugibazydanych.sqlcodecreator.service;

import com.systemobslugibazydanych.login.model.User;
import com.systemobslugibazydanych.login.repository.UserRepository;
import com.systemobslugibazydanych.sqlcodecreator.model.DatabaseTable;
import com.systemobslugibazydanych.sqlcodecreator.repository.CreateSchemaRepository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import java.io.*;
import java.io.FileReader;
import java.io.Reader;

@Service
public class CreateSchemaService {

    private CreateSchemaRepository createSchemaRepository;
    private UserRepository userRepository;

    public CreateSchemaService(CreateSchemaRepository createSchemaRepository, UserRepository userRepository){
        this.createSchemaRepository = createSchemaRepository;
        this.userRepository = userRepository;
    }

    public static String readAllCharactersOneByOne(Reader reader) throws IOException {
        StringBuilder content = new StringBuilder();
        int nextChar;
        while ((nextChar = reader.read()) != -1) {
            content.append((char) nextChar);
        }
        return String.valueOf(content);
    }

    public DatabaseTable nazwametody(DatabaseTable databaseTable){

        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails)principal).getUsername();
        } else {
            username = principal.toString();
        }
        User user = userRepository.findByEmail(username);

        String filename = user.getId() + "_" + databaseTable.getName()+".sql";
        File file = new File("C:/Users/Alfu/IdeaProjects/Inzynierka/src/main/resources/sqlCodeFile/" + filename);
        FileWriter fileWriter = null;
        try {
            fileWriter = new FileWriter(file);
            fileWriter.write("DROP SCHEMA IF EXISTS '"+databaseTable.getName()+"';\n" + "CREATE SCHEMA '"+databaseTable.getName()+"';");
            fileWriter.close();
        } catch (IOException e) {
            e.printStackTrace();
        }

        databaseTable = createSchemaRepository.save(databaseTable);
        return databaseTable;
    }


}



