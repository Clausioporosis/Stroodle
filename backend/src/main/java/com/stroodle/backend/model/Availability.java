package com.stroodle.backend.model;

import lombok.Data;

import org.springframework.data.annotation.Id;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Map;

@Data
public class Availability {
    @Id
    private String userId;
    private Map<DayOfWeek, List<TimePeriod>> availability;
}
