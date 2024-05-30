package com.stroodle.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "polls")
public class Poll {
    @Id
    private String id;

    private String organizerId;

    @NotBlank(message = "Title cannot be empty.")
    @Size(min = 2, max = 50, message = "Title must be between 2 and 50 characters long.")
    private String title;

    @Size(max = 1000, message = "Description cannot be longer than 100 characters.")
    private String description;

    private String location;

    private String duration;

    private List<String> participantIds;

    private List<ProposedDate> proposedDates;

    private Number bookedDateIndex;
}