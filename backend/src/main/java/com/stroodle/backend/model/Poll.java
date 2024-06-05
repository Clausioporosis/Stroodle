package com.stroodle.backend.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Poll {
    @Id
    private String id;

    private String organizerId;

    private String title;

    private String description;

    private String location;

    private String duration;

    private List<String> participantIds;

    private List<ProposedDate> proposedDates;

    private Number bookedDateIndex;
}