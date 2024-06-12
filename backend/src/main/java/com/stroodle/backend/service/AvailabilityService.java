package com.stroodle.backend.service;

import java.time.DayOfWeek;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Optional;
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

    public Optional<Availability> getAvailability(String userId) {
        return availabilityRepository.findById(userId);
    }

    public Availability mergeAvailabilities(List<String> userIds) {
        System.out.println("Merging availabilities for users: " + userIds);
        Map<DayOfWeek, List<TimePeriod>> mergedAvailability = new HashMap<>();

        for (DayOfWeek day : DayOfWeek.values()) {
            mergedAvailability.put(day, new ArrayList<>());
        }

        for (String userId : userIds) {
            Optional<Availability> optionalAvailability = getAvailability(userId);
            if (!optionalAvailability.isPresent()) {
                System.out.println("Skipping user with no availability: " + userId);
                continue;
            }
            Availability availability = optionalAvailability.get();

            for (Map.Entry<DayOfWeek, List<TimePeriod>> entry : availability.getAvailability().entrySet()) {
                mergedAvailability.get(entry.getKey()).addAll(entry.getValue());
            }
        }

        for (Map.Entry<DayOfWeek, List<TimePeriod>> entry : mergedAvailability.entrySet()) {
            List<TimePeriod> mergedPeriods = mergeTimePeriods(entry.getValue());
            entry.setValue(mergedPeriods);
        }

        Map<DayOfWeek, List<TimePeriod>> invertedAvailability = new HashMap<>();
        for (Map.Entry<DayOfWeek, List<TimePeriod>> entry : mergedAvailability.entrySet()) {
            List<TimePeriod> invertedPeriods = invertTimePeriods(entry.getValue());
            invertedAvailability.put(entry.getKey(), invertedPeriods);
        }

        Availability result = new Availability();
        result.setAvailability(invertedAvailability);
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

    private List<TimePeriod> invertTimePeriods(List<TimePeriod> periods) {
        List<TimePeriod> inverted = new ArrayList<>();
        LocalTime startOfDay = LocalTime.MIN;
        LocalTime endOfDay = LocalTime.MAX;

        if (periods.isEmpty()) {
            inverted.add(new TimePeriod(startOfDay, endOfDay));
            return inverted;
        }

        periods.sort(Comparator.comparing(TimePeriod::getStart));

        if (!periods.get(0).getStart().equals(startOfDay)) {
            inverted.add(new TimePeriod(startOfDay, periods.get(0).getStart()));
        }

        for (int i = 0; i < periods.size() - 1; i++) {
            inverted.add(new TimePeriod(periods.get(i).getEnd(), periods.get(i + 1).getStart()));
        }

        if (!periods.get(periods.size() - 1).getEnd().equals(endOfDay)) {
            inverted.add(new TimePeriod(periods.get(periods.size() - 1).getEnd(), endOfDay));
        }

        return inverted;
    }
}