package com.stroodle.backend.model;

import java.time.LocalTime;

public class TimePeriod {
    private LocalTime start;
    private LocalTime end;

    public TimePeriod(LocalTime start, LocalTime end) {
        this.start = start;
        this.end = end;
    }

    public LocalTime getStart() {
        return this.start;
    }

    public void setStart(LocalTime start) {
        this.start = start;
    }

    public LocalTime getEnd() {
        return this.end;
    }

    public void setEnd(LocalTime end) {
        this.end = end;
    }
}
