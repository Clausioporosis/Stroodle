package com.stroodle.backend;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Document(collection = "users")
public class User {
    @Id
    private String id;

    @NotBlank(message = "Name darf nicht leer sein.")
    @Size(min = 2, max = 30, message = "Name muss zwischen 2 und 30 Zeichen lang sein.")
    @Field("name")
    private String name;

    @NotBlank(message = "Email darf nicht leer sein.")
    @Email(message = "Ungültige Email-Adresse.")
    @Field("email")
    private String email;

    // Constructors
    public User() {
    }

    public User(String name, String email) {
        this.name = name;
        this.email = email;
    }

    // Getter and Setter methods
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    // toString method for debugging purposes
    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", name='" + name + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
