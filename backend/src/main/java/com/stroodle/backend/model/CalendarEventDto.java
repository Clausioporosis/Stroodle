package com.stroodle.backend.model;

import lombok.Data;
import java.util.Date;

@Data
public class CalendarEventDto {
    private String title;
    private Date start;
    private Date end;
    private boolean allDay;
}
