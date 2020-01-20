package com.systemobslugibazydanych.service;

import com.systemobslugibazydanych.repository.CustomerRepository;
import com.systemobslugibazydanych.repository.DatabaseTableRepository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.EntityTransaction;
import java.io.*;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class DatabaseTableService {

    @Autowired
    SomeService someService;

    @Autowired
    private final JdbcTemplate jdbcTemplate;


    private DatabaseTableRepository databaseTableRepository;
    private CustomerRepository customerRepository;
    private List<Map<String, Object>> mapList;
    private List<Map<String, Object>> emptyMapList = null;
    private boolean updateFlag = false;

    public DatabaseTableService(DatabaseTableRepository databaseTableRepository, CustomerRepository customerRepository) {
        this.databaseTableRepository = databaseTableRepository;
        this.customerRepository = customerRepository;
        jdbcTemplate = null;
    }

    public static String readAllCharactersOneByOne(Reader reader) throws IOException {
        StringBuilder content = new StringBuilder();
        int nextChar;
        while ((nextChar = reader.read()) != -1) {
            content.append((char) nextChar);
        }
        return String.valueOf(content);
    }


    @Transactional
    public ArrayList<String> executeSQL(String[] split) {
        SessionFactory hibernateFactory = someService.getHibernateFactory();
        EntityManager entityManager = hibernateFactory.createEntityManager();
        EntityTransaction utx = entityManager.getTransaction();
        ArrayList<String> listException = new ArrayList<String>();
        boolean flag = false;
        for (int i = 0; i < split.length; ++i) {
            String query = split[i];
            try {
                utx.begin();
                mapList = jdbcTemplate.queryForList(query);
                utx.commit();
                listException.add("Operacja została wykonana pomyślnie!");
            } catch (Exception e1) {
                utx.rollback();
                try {
                    utx.begin();
                    int rows = jdbcTemplate.update(query);
                    utx.commit();
                    listException.add("Operacja została wykonana pomyślnie! { [" + rows + "] <-- zaktualizowane wiersze }");
                } catch (Exception e2) {
                    utx.rollback();
                    flag = true;
                    listException.add(e2.getCause().getMessage());
                }
            }
        }
        entityManager.close();
        if(flag){
            mapList = emptyMapList;
            updateFlag = false;
        }
        else{
            updateFlag = true;
        }
        return listException;
    }


    public void nazwametody(String[] split) {


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

    public List<Map<String, Object>> getMapList() {
        return mapList;
    }

    public void setMapList(List<Map<String, Object>> mapList) {
        this.mapList = mapList;
    }

    public void clearMapList() {
        mapList.clear();
    }

    public boolean isUpdateFlag() {
        return updateFlag;
    }

    public void setUpdateFlag(boolean updateFlag) {
        this.updateFlag = updateFlag;
    }
}



