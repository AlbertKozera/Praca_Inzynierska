package com.systemobslugibazydanych.service;

import com.systemobslugibazydanych.dto.SaveSchemaInDatabaseDTO;
import com.systemobslugibazydanych.entity.Schemas;
import com.systemobslugibazydanych.exception.NoSchemaException;
import com.systemobslugibazydanych.repository.SchemasRepository;
import com.systemobslugibazydanych.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.datasource.DataSourceUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.io.*;
import java.io.Reader;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class SchemasService {

    @Autowired
    private final JdbcTemplate jdbcTemplate = null;
    @Autowired
    private PlatformTransactionManager ptm;
    @Autowired
    private UsersRepository usersRepository;
    @Autowired
    private SchemasRepository schemasRepository;

    @PersistenceContext
    EntityManager entityManager;


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

    /**
     * Interpreter SQL
     * @param queryRows
     * @return
     */
    public ArrayList<String> executeSQL(String[] queryRows) {
        ArrayList<String> listException = new ArrayList<String>();
        for (int i = 0; i < queryRows.length; ++i) {
            // Select statement
            if(queryRows[i].trim().length() > 5 &&
                    queryRows[i].trim().substring(0, 6).toUpperCase().equals("SELECT")){
                try{
                    mapList = jdbcTemplate.queryForList(queryRows[i]);
                    int rows = mapList.size();
                    listException.add("Operacja została wykonana pomyślnie! { zaafektowane wiersze --> [" + rows + "] }");
                    updateFlag = true;
                }catch (DataAccessException exceptionSelect){
                    listException.add(exceptionSelect.getCause().getMessage());
                    updateFlag = false;
                    break;
                }
            }
            // DDL statement
            else if(whatKindOfStatementIsThat(queryRows[i],"DDL")){
                try{
                    jdbcTemplate.execute(queryRows[i]);
                    listException.add("Operacja została wykonana pomyślnie!");
                    updateFlag = true;
                }catch (DataAccessException exceptionDDL){
                    listException.add(exceptionDDL.getCause().getMessage());
                    updateFlag = false;
                    break;
                }
            }
            // DML statement
            else if (whatKindOfStatementIsThat(queryRows[i],"DML")){
                try {
                    int rows = jdbcTemplate.update(queryRows[i]);
                    listException.add("Operacja została wykonana pomyślnie! " +
                            "{ zaafektowane wiersze --> [" + rows + "] }");
                    updateFlag = true;
                }catch (DataAccessException exceptionDML){
                    listException.add(exceptionDML.getCause().getMessage());
                    updateFlag = false;
                    break;
                }
            }
            // Else statement
            else{
                try{
                    jdbcTemplate.execute(queryRows[i]);
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
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailOfCurrentUser = authentication.getName();
        Schemas schemas;

        if(schemasRepository.findBySchemaName(saveSchemaInDatabaseDTO.getSchemaName()) == null){
            schemas = new Schemas();
        }
        else {
            schemas = schemasRepository.findBySchemaName(saveSchemaInDatabaseDTO.getSchemaName());
        }
        schemas.setSchemaERD(saveSchemaInDatabaseDTO.getDiagramJson());
        schemas.setSchemaName(saveSchemaInDatabaseDTO.getSchemaName());
        schemas.setUsers(usersRepository.findByEmail(emailOfCurrentUser));
        schemasRepository.save(schemas);

    }

    public List<Schemas> getAllSchemasForCurrentUser(){
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String emailOfCurrentUser = authentication.getName();
        return schemasRepository.findByUserId(usersRepository.findByEmail(emailOfCurrentUser));
    }

    public void dropUserById(Integer id){
        String userName = schemasRepository.findById(id).orElseThrow(() -> new NoSchemaException("No schema for id="+id)).getSchemaName();
        schemasRepository.deleteById(id);
        jdbcTemplate.execute("DROP USER \"" + userName + "\" CASCADE");
    }

    public void dropUserByUsername(String userName){
        jdbcTemplate.execute("DROP USER " + userName + " CASCADE");
    }

    public String editUser(Integer id){
        return schemasRepository.findById(id).orElseThrow(() -> new NoSchemaException("No schemaErd for id="+id)).getSchemaERD();
    }

    public String returnNameById(Integer id){
        return schemasRepository.findById(id).orElseThrow(() -> new NoSchemaException("No schemaName for id="+id)).getSchemaName();
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



