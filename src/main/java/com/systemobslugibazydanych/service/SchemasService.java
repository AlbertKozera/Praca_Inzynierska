package com.systemobslugibazydanych.service;

import com.systemobslugibazydanych.DTO.SaveSchemaInDatabaseDTO;
import com.systemobslugibazydanych.entity.Schemas;
import com.systemobslugibazydanych.entity.Users;
import com.systemobslugibazydanych.repository.UsersRepository;
import com.systemobslugibazydanych.repository.SchemasRepository;
import org.apache.catalina.User;
import org.hibernate.Session;
import org.hibernate.SessionFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import javax.persistence.EntityManagerFactory;
import java.io.*;
import java.io.Reader;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class SchemasService {

    @Autowired
    private final JdbcTemplate jdbcTemplate = null;
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private SchemasRepository schemasRepository;

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

    public void dropUser(String userName){
        jdbcTemplate.execute("DROP USER " + userName + " CASCADE");
    }

    public ArrayList<String> executeSQL(String[] queryRows) {
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

    public void saveSchemaInDatabase(SaveSchemaInDatabaseDTO saveSchemaInDatabaseDTO){
        Schemas schemas = new Schemas();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailOfCurrentUser = authentication.getName();

        schemas.setSchemaERD(saveSchemaInDatabaseDTO.getDiagramJson());
        schemas.setSchemaName(saveSchemaInDatabaseDTO.getSchemaName());
        schemas.setUsers(usersRepository.findByEmail(emailOfCurrentUser));
        schemasRepository.save(schemas);
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



