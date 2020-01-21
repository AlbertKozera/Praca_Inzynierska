package com.systemobslugibazydanych.service;

import com.systemobslugibazydanych.repository.CustomerRepository;
import com.systemobslugibazydanych.repository.DatabaseTableRepository;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.hibernate.query.NativeQuery;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.EntityTransaction;
import javax.persistence.PersistenceContext;
import java.io.*;
import java.io.Reader;
import java.sql.Connection;
import java.sql.Statement;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class DatabaseTableService {

    @Autowired
    SomeService someService;

    @Autowired
    private final JdbcTemplate jdbcTemplate;

    @Autowired
    private EntityManagerFactory entityManagerFactory;


    private DatabaseTableRepository databaseTableRepository;
    private CustomerRepository customerRepository;
    private List<Map<String, Object>> mapList;
    private List<Map<String, Object>> emptyMapList = null;
    private boolean updateFlag = false;
    private List<String> statementsListDDL = Arrays.asList("ALTER", "ANALYZE", "ASSOCIATE STATISTICS", "AUDIT", "COMMENT", "CREATE", "DISASSOCIATE STATISTICS",
            "DROP", "GRANT", "NOAUDIT", "PURGE", "RENAME", "REVOKE", "TRUNCATE", "UNDROP");
    private List<String> statementsListDML = Arrays.asList("CALL", "DELETE", "EXPLAIN PLAN", "INSERT", "LOCK TABLE", "MERGE", "SELECT", "UPDATE");
    private Map<String, List<String>> typesOfStatements = new HashMap<String, List<String>>(){{
        put("DDL", statementsListDDL);
        put("DML", statementsListDML);
    }};

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

    public boolean whatKindOfStatementIsThat(String query, String typeOfStatement){
        boolean success = false;
        for(int i = 0; i < typesOfStatements.get(typeOfStatement).size(); ++i){
            if(Pattern.compile(Pattern.quote(typesOfStatements.get(typeOfStatement).get(i)), Pattern.CASE_INSENSITIVE).matcher(query).find()){
                success = true;
                break;
            }
        }
        return success;
    }

    public void dropUser(){
        jdbcTemplate.execute("DROP USER " + queryRows[0].split( " ")[2] + " CASCADE");
    }


    public ArrayList<String> executeSQL(String[] queryRows) {
        SessionFactory hibernateFactory = someService.getHibernateFactory();
        Session session = hibernateFactory.openSession();

        ArrayList<String> listException = new ArrayList<String>();
        for (int i = 0; i < queryRows.length; ++i) {
            String query = queryRows[i];
            if(query.trim().length() > 5 && query.trim().substring(0, 6).toUpperCase().equals("SELECT")){
                try{
                    mapList = jdbcTemplate.queryForList(query);
                    int rows = mapList.size();
                    listException.add("Operacja została wykonana pomyślnie! { zaafektowane wiersze --> [" + rows + "] }");
                    updateFlag = true;
                }catch (DataAccessException exceptionSelect){
                    listException.add(exceptionSelect.getCause().getMessage());
                    updateFlag = false;
                    break;
                }
            }
            else if(whatKindOfStatementIsThat(query,"DDL")){
                try{
                    jdbcTemplate.execute(query);
                    listException.add("Operacja została wykonana pomyślnie!");
                    updateFlag = true;
                }catch (DataAccessException exceptionDDL){
                    listException.add(exceptionDDL.getCause().getMessage());
                    updateFlag = false;
                    break;
                }
            }
            else if (whatKindOfStatementIsThat(query,"DML")){
                try {
                    int rows = jdbcTemplate.update(query);
                    listException.add("Operacja została wykonana pomyślnie! { zaafektowane wiersze --> [" + rows + "] }");
                    updateFlag = true;
                }catch (DataAccessException exceptionDML){
                    listException.add(exceptionDML.getCause().getMessage());
                    updateFlag = false;
                    break;
                }
            }
            else{
                try{
                    jdbcTemplate.execute(query);
                    listException.add("Operacja została wykonana pomyślnie!");
                    updateFlag = true;
                }catch (Exception exception){
                    listException.add(exception.getCause().getMessage());
                    updateFlag = false;
                    break;
                }
            }
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
        mapList = emptyMapList;
    }

    public boolean isUpdateFlag() {
        return updateFlag;
    }

    public void setUpdateFlag(boolean updateFlag) {
        this.updateFlag = updateFlag;
    }
}



