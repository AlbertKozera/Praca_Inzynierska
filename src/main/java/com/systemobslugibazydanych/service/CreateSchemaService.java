package com.systemobslugibazydanych.service;

import com.systemobslugibazydanych.entity.User;
import com.systemobslugibazydanych.repository.UserRepository;
import com.systemobslugibazydanych.entity.DatabaseTable;
import com.systemobslugibazydanych.repository.CreateSchemaRepository;
import org.hibernate.Session;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.*;
import java.io.Reader;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.List;

@Service
public class CreateSchemaService {

    @PersistenceContext
    private EntityManager entityManager;

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












/*        // session
        Session session = null;
        if (entityManager == null
                || (session = entityManager.unwrap(Session.class)) == null) {

            throw new NullPointerException();
        }
        List<String> resultList;
        String query = null;
        try {
            query = new String(Files.readAllBytes(Paths.get(ClassLoader.getSystemResource(filename).toURI())));
        } catch (IOException | URISyntaxException e) {
            e.printStackTrace();
        }
        String finalQuery = query;
        session.doWork(connection -> connection.prepareStatement(finalQuery).execute());
        resultList = entityManager.createNativeQuery("SHOW DATABASES;").getResultList();
        for(String x: resultList){
            System.out.println(x);
        }
        try {
            query = new String(Files.readAllBytes(Paths.get(ClassLoader.getSystemResource(filename).toURI())));
        } catch (IOException | URISyntaxException e) {
            e.printStackTrace();
        }
        session.createNativeQuery(query);
        session.close();*/

















        databaseTable = createSchemaRepository.save(databaseTable);
        return databaseTable;
    }
}



