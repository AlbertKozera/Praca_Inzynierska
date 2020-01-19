package com.systemobslugibazydanych.service;

import com.systemobslugibazydanych.repository.CustomerRepository;
import com.systemobslugibazydanych.entity.DatabaseTable;
import com.systemobslugibazydanych.repository.DatabaseTableRepository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.cache.spi.support.EntityTransactionalAccess;
import org.hibernate.exception.SQLGrammarException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import javax.persistence.PersistenceException;
import javax.persistence.Query;
import javax.transaction.UserTransaction;
import java.awt.*;
import java.io.*;
import java.io.Reader;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.SQLException;
import java.sql.SQLSyntaxErrorException;
import java.util.Arrays;
import java.util.List;

@Service
public class DatabaseTableService {

    @Autowired
    SomeService someService;

    private DatabaseTableRepository databaseTableRepository;
    private CustomerRepository customerRepository;

    public DatabaseTableService(DatabaseTableRepository databaseTableRepository, CustomerRepository customerRepository){
        this.databaseTableRepository = databaseTableRepository;
        this.customerRepository = customerRepository;
    }

    public static String readAllCharactersOneByOne(Reader reader) throws IOException {
        StringBuilder content = new StringBuilder();
        int nextChar;
        while ((nextChar = reader.read()) != -1) {
            content.append((char) nextChar);
        }
        return String.valueOf(content);
    }


    public String executeSQL(String[] split){
        SessionFactory hibernateFactory = someService.getHibernateFactory();
        String wyjatek = null;
        int rows = 0;
        EntityManager entityManager = hibernateFactory.createEntityManager();
        EntityTransaction utx = entityManager.getTransaction();
        for (int i = 0; i < split.length; i++) {
            String query = split[i];
            try {
                utx.begin();
                Query query1 = entityManager.createNativeQuery(query);
                rows = query1.executeUpdate();
                utx.commit();

                try{
                    List<Object[]> resultList = query1.getResultList();
                    resultList.stream().map(Arrays::toString).forEach(System.out::println);
                }
                catch(Exception e){
                }


                wyjatek = "Operacja została wykonana pomyślnie \nwpływ na wiersze ["+rows+"]";
            }catch (PersistenceException e){
                utx.rollback();
                wyjatek = (((SQLGrammarException)e.getCause()).getSQLException()).getMessage();
            }
        }
        entityManager.close();
        return wyjatek;
    }



    public void nazwametody(String[] split){


/*        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails)principal).getUsername();
        } else {
            username = principal.toString();
        }
        User user = userRepository.findByEmail(username);

        String filename = user.getId() + "_" + databaseTable.getName()+".sql";*/
/*        File file = new File("C:/Users/Alfu/IdeaProjects/Inzynierka/src/main/resources/sqlCodeFile/" + filename);
        FileWriter fileWriter = null;
        try {
            fileWriter = new FileWriter(file);
            fileWriter.write("DROP SCHEMA IF EXISTS '"+databaseTable.getName()+"';\n" + "CREATE SCHEMA '"+databaseTable.getName()+"';");
            fileWriter.close();
        } catch (IOException e) {
            e.printStackTrace();
        }*/







       SessionFactory hibernateFactory = someService.getHibernateFactory();
        Session session = hibernateFactory.openSession();
       /*  String query1 = null;
        try {
            query1 = new String(Files.readAllBytes(Paths.get(ClassLoader.getSystemResource("test.sql").toURI())));
        } catch (IOException | URISyntaxException e) {
            e.printStackTrace();
        }
        String finalQuery = query1;
        session.doWork(connection -> connection.prepareStatement(finalQuery).execute());*/


        for (int i = 0; i < split.length; i++) {
            String query = split[i];
            session.doWork(connection -> connection.prepareStatement(query).execute());
        }
        session.close();











/*
        databaseTable = databaseTableRepository.save(databaseTable);
        return databaseTable;*/
    }
}



