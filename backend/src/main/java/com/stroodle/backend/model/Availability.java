package com.stroodle.backend.model;

import java.util.List;
import java.time.DayOfWeek;
import java.util.Map;

public class Availability {
    private Map<DayOfWeek, List<TimePeriod>> availability;

    public Availability() {
    }

    public Availability(Map<DayOfWeek, List<TimePeriod>> availability) {
        this.availability = availability;
    }

    public Map<DayOfWeek, List<TimePeriod>> getAvailability() {
        return availability;
    }

    public void setAvailability(Map<DayOfWeek, List<TimePeriod>> availability) {
        this.availability = availability;
    }

    @Override
    public String toString() {
        return "Availability{" +
                "availability=" + availability +
                '}';
    }
}