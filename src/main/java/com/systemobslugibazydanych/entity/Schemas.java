package com.systemobslugibazydanych.entity;

import javax.persistence.*;

@Entity
@Table(name = "schemas")
public class Schemas {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "schema_id")
    private Integer id;

    @Column(name = "schema_name")
    private String schemaName;

    @Column(name = "schema_ERD")
    private String schemaERD;

    @ManyToOne
    @JoinColumn(name = "user_idFK")
    private Customer customer;


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getSchemaName() {
        return schemaName;
    }

    public void setSchemaName(String schemaName) {
        this.schemaName = schemaName;
    }

    public String getSchemaERD() {
        return schemaERD;
    }

    public void setSchemaERD(String schemaERD) {
        this.schemaERD = schemaERD;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
    }
}