package com.stroodle.backend.model;

import java.time.LocalTime;
import lombok.Data;

@Data
public class TimePeriod {
    private LocalTime start;
    private LocalTime end;
}
