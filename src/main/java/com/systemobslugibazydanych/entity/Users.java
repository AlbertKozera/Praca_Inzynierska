package com.systemobslugibazydanych.entity;

import java.util.List;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

@Entity
@Table(name = "users")
public class Users {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Column(name = "user_id")
	private Integer id;

	@NotNull(message="Imie jest obowiązkowe")
	@Length(min=3, message="Imie musi składać się conajmniej z 3 znaków")
	@Length(max=25, message="Imie może składać się maksymalnie z 25 znaków")
	@Column(name = "first_name")
	private String firstName;

	@NotNull(message="Nazwisko jest obowiązkowe")
	@Length(min=3, message="Nazwisko musi składać się conajmniej z 3 znaków")
	@Length(max=25, message="Nazwisko może składać się maksymalnie z 25 znaków")
	@Column(name = "last_name")
	private String lastName;

	@NotNull(message="Email jest obowiązkowy")
	@Length(min=3, message="Email musi składać się conajmniej z 3 znaków")
	@Email(message = "Email jest nieprawidłowy")
	@Column(name = "email")
	private String email;

	@NotNull(message="Hasło jest obowiązkowe")
	@Length(min=5, message="Hasło nie może być krótsze niż 5 znaków")
	@Column(name = "password")
	private String password;

	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
	private Set<Role> roles;

	@OneToMany(mappedBy = "users", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private List<Schemas> schemas;


	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
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

	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}

	public List<Schemas> getSchemas() {
		return schemas;
	}

	public void setSchemas(List<Schemas> schemas) {
		this.schemas = schemas;
	}
}
