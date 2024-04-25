package com.stroodle.backend;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

//@Data
@Document
public class User {
    @Id
    private String id;
    private String username;
    private String email;
    private String password; // In der realen Anwendung sollte dies gehasht gespeichert werden
    private String fullName;
}
