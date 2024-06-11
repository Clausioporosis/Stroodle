package com.stroodle.backend.model;

import java.time.LocalTime;
import lombok.Data;

@Data
public class TimePeriod {
    private LocalTime start;
    private LocalTime end;

    public TimePeriod(LocalTime start, LocalTime end) {
        this.start = start;
        this.end = end;
    }

    public boolean overlapsWith(TimePeriod other) {
        return !this.end.isBefore(other.start) && !other.end.isBefore(this.start);
    }

    public TimePeriod mergeWith(TimePeriod other) {
        if (!overlapsWith(other)) {
            throw new IllegalArgumentException("Time periods do not overlap and cannot be merged");
        }
        return new TimePeriod(
                this.start.isBefore(other.start) ? this.start : other.start,
                this.end.isAfter(other.end) ? this.end : other.end
        );
    }
}
