package com.stroodle.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Document(collection = "polls")
public class Poll {
    @Id
    private String id;

    @NotBlank(message = "Title cannot be empty.")
    @Size(min = 2, max = 50, message = "Title must be between 2 and 50 characters long.")
    @Field("title")
    private String title;

    @Size(max = 100, message = "Description cannot be longer than 100 characters.")
    @Field("description")
    private String description;

    // Constructors
    public Poll() {
    }

    public Poll(String title, String description) {
        this.title = title;
        this.description = description;
    }

    // Getter and Setter methods
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
