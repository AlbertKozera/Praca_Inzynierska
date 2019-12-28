package com.systemobslugibazydanych.entity;

import org.hibernate.validator.constraints.Length;

import javax.persistence.*;

@Entity
@Table(name = "databasetable")
public class DatabaseTable {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO) // poprawić na identity
    @Column(name = "database_id")
    private Integer databaseId;

    @Column(name = "name")
    @Length(min=1, max=64, message="Nazwa bazy danych musi miec >1 i <64")
    private String name;

    @Column(name = "sql_code_path")    //, nullable = false)
    private String sqlCodePath;

    @ManyToOne
    @JoinColumn(name = "user_idFK")
    private Customer customer;

    public Integer getDatabaseId() {
        return databaseId;
    }

    public void setDatabaseId(Integer databaseId) {
        this.databaseId = databaseId;
    }

    public String getName() {
        return name;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSqlCodePath() {
        return sqlCodePath;
    }

    public void setSqlCodePath(String sqlCodePath) {
        this.sqlCodePath = sqlCodePath;
    }


}