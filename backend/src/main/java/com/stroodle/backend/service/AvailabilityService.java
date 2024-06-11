package com.stroodle.backend.service;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stroodle.backend.exception.ResourceNotFoundException;
import com.stroodle.backend.model.Availability;
import com.stroodle.backend.model.TimePeriod;
import com.stroodle.backend.repository.AvailabilityRepository;

@Service
public class AvailabilityService {

    @Autowired
    private AvailabilityRepository availabilityRepository;

    public void setAvailability(String userId, Availability availability) {
        availability.setUserId(userId);
        availabilityRepository.save(availability);
    }

    public Availability getAvailability(String userId) {
        return availabilityRepository.findById(userId)
                .orElseThrow(
                        () -> new ResourceNotFoundException("Availability for user with id " + userId + " not found"));
    }

    public Availability mergeAvailabilities(List<String> userIds) {
        Map<DayOfWeek, List<TimePeriod>> mergedAvailability = new HashMap<>();

        for (DayOfWeek day : DayOfWeek.values()) {
            mergedAvailability.put(day, new ArrayList<>());
        }

        for (String userId : userIds) {
            Availability availability = getAvailability(userId);
            for (Map.Entry<DayOfWeek, List<TimePeriod>> entry : availability.getAvailability().entrySet()) {
                mergedAvailability.get(entry.getKey()).addAll(entry.getValue());
            }
        }

        for (Map.Entry<DayOfWeek, List<TimePeriod>> entry : mergedAvailability.entrySet()) {
            List<TimePeriod> mergedPeriods = mergeTimePeriods(entry.getValue());
            entry.setValue(mergedPeriods);
        }

        Availability result = new Availability();
        result.setAvailability(mergedAvailability);
        return result;
    }

    private List<TimePeriod> mergeTimePeriods(List<TimePeriod> periods) {
        if (periods.isEmpty()) {
            return periods;
        }

        periods.sort(Comparator.comparing(TimePeriod::getStart));

        List<TimePeriod> merged = new ArrayList<>();
        TimePeriod current = periods.get(0);

        for (int i = 1; i < periods.size(); i++) {
            TimePeriod next = periods.get(i);
            if (current.overlapsWith(next)) {
                current = current.mergeWith(next);
            } else {
                merged.add(current);
                current = next;
            }
        }

        merged.add(current);
        return merged;
    }
}