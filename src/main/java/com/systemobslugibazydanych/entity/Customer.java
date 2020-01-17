package com.systemobslugibazydanych.entity;

import java.util.List;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

@Entity
@Table(name = "customer")
public class Customer {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "user_id")
	private int id;

	@NotNull(message="First name is compulsory")
	@Length(min=3, message="Imie musi składać się conajmniej z 3 znaków")
	@Length(max=25, message="Imie może składać się maksymalnie z 25 znaków")
	@Column(name = "first_name")
	private String name;

	@NotNull(message="Last name is compulsory")
	@Length(min=3, message="Nazwisko musi składać się conajmniej z 3 znaków")
	@Length(max=25, message="Nazwisko może składać się maksymalnie z 25 znaków")
	@Column(name = "last_name")
	private String lastName;

	@NotNull(message="Email is compulsory")
	@Length(min=3, message="Email musi składać się conajmniej z 3 znaków")
	@Email(message = "Email jest nieprawidłowy")
	@Column(name = "email")
	private String email;

	@NotNull(message="Password is compulsory")
	@Length(min=5, message="Hasło nie może być krótsze niż 5 znaków")
	@Length(max=25, message="Hasło nie może być dłuższe niż 25 znaków")
	@Column(name = "password")
	private String password;

	@Column(name = "status")
	private String status;

	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
	private Set<Role> roles;

	@OneToMany(mappedBy = "customer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<DatabaseTable> databaseTables;


	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}

	public List<DatabaseTable> getDatabaseTables() {
		return databaseTables;
	}

	public void setDatabaseTables(List<DatabaseTable> databaseTables) {
		this.databaseTables = databaseTables;
	}
}
