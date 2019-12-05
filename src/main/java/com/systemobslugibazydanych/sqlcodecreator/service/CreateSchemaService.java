package com.systemobslugibazydanych.sqlcodecreator.service;

import com.systemobslugibazydanych.sqlcodecreator.model.DatabaseTable;
import com.systemobslugibazydanych.sqlcodecreator.repository.CreateSchemaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class CreateSchemaService {

    @Autowired
    CreateSchemaRepository createSchemaRepository;

    public DatabaseTable nazwametody(DatabaseTable databaseTable)
    {
        databaseTable = createSchemaRepository.save(databaseTable);
        return databaseTable;
    }
}
