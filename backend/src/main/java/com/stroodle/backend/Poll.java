package com.stroodle.backend;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Document(collection = "polls")
public class Poll {
    @Id
    private String id;

    @Field("organizerId")
    private String organizerId;

    @NotBlank(message = "Title cannot be empty.")
    @Size(min = 2, max = 50, message = "Title must be between 2 and 50 characters long.")
    @Field("title")
    private String title;

    @Size(max = 1000, message = "Description cannot be longer than 100 characters.")
    @Field("description")
    private String description;

    @Field("location")
    private String location;

    @Field("duration")
    private String duration;

    @Field("participantsIds")
    private List<String> participantIds;

    @Field("proposedDates")
    private List<ProposedDate> proposedDates;

    // Constructors
    public Poll() {
    }

    public Poll(String title, String description, String location, String duration, String organizerId,
            List<ProposedDate> proposedDates,
            List<String> participantIds) {
        this.organizerId = organizerId;
        this.title = title;
        this.description = description;
        this.location = location;
        this.duration = duration;
        this.participantIds = participantIds;
        this.proposedDates = proposedDates;
    }

    // Getter and Setter methods
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOrganizerId() {
        return organizerId;
    }

    public void setOrganizerId(String organizerId) {
        this.organizerId = organizerId;
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

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public List<String> getParticipantIds() {
        return participantIds;
    }

    public void setParticipantIds(List<String> participantIds) {
        this.participantIds = participantIds;
    }

    public List<ProposedDate> getProposedDates() {
        return proposedDates;
    }

    public void setProposedDates(List<ProposedDate> proposedDates) {
        this.proposedDates = proposedDates;
    }
}
