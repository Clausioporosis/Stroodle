package com.stroodle.backend;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
import java.util.List;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Document(collection = "users")
public class User {
    @Id
    private String id;

    @NotBlank(message = "Name cannot be empty.")
    @Size(min = 2, max = 30, message = "Name must be between 2 and 30 characters long.")
    @Field("name")
    private String name;

    @NotBlank(message = "Email cannot be empty.")
    @Email(message = "Invalid email address.")
    @Field("email")
    private String email;

    private List<AvailabilityRule> availabilityRules;

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

    public List<AvailabilityRule> getAvailabilityRules() {
        return availabilityRules;
    }

    public void setAvailabilityRules(List<AvailabilityRule> availabilityRules) {
        this.availabilityRules = availabilityRules;
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
