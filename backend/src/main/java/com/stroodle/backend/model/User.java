package com.stroodle.backend.model;

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

    @NotBlank(message = "First name cannot be empty.")
    @Size(min = 2, max = 15, message = "First name must be between 2 and 15 characters long.")
    @Field("firstName")
    private String firstName;

    @NotBlank(message = "Last name cannot be empty.")
    @Size(min = 2, max = 15, message = "Last name must be between 2 and 15 characters long.")
    @Field("lastName")
    private String lastName;

    @NotBlank(message = "Email cannot be empty.")
    @Email(message = "Invalid email address.")
    @Field("email")
    private String email;

    private List<AvailabilityRule> availabilityRules; // ToDo: Change availibilityRule model

    // Constructors
    public User() {
    }

    public User(String firstName, String lastNameame, String email) {
        this.firstName = firstName;
        this.lastName = lastNameame;
        this.email = email;
    }

    // Getter and Setter methods
    public String getId() {
        return id;
    }

    public void setId(String id) {
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
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
