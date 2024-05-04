package com.stroodle.backend;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Document(collection = "polls")
public class Poll {
    @Id
    private String id;

    @NotBlank(message = "Titel darf nicht leer sein.")
    @Size(min = 2, max = 50, message = "Titel muss zwischen 2 und 50 Zeichen lang sein.")
    @Field("title")
    private String title;

    @Size(max = 100, message = "Beschreibung darf nicht länger als 100 Zeichen sein.")
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
