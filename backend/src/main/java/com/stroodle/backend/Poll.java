package com.stroodle.backend;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

//@Data
@Document
public class Poll {
    @Id
    private String id;
    private String title;
    private String description;
    private String organizerId;
    private List<String> participantIds;
    private String finalDate;
    private String status;
}
