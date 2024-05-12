package com.stroodle.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.time.DayOfWeek;

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

    @Field("availability")
    private Map<DayOfWeek, List<TimePeriod>> availability;

    // Constructors
    public User() {
    }

    public User(String firstName, String lastNameame, String email, Map<DayOfWeek, List<TimePeriod>> availability) {
        this.firstName = firstName;
        this.lastName = lastNameame;
        this.email = email;
        this.availability = availability;
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

    public Map<DayOfWeek, List<TimePeriod>> getAvailability() {
        return availability;
    }

    public void setAvailability(Map<DayOfWeek, List<TimePeriod>> availability) {
        this.availability = availability;
    }

    // toString method for debugging purposes
    @Override
    public String toString() {
        return "User{" +
                "id='" + id + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", email='" + email + '\'' +
                ", availability='" + availability + '\'' +
                '}';
    }
}
