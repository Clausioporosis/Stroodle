package com.stroodle.backend.service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.stroodle.backend.repository.IcsRepository;
import com.stroodle.backend.model.Ics;
import com.stroodle.backend.model.IcsStatusDto;
import com.stroodle.backend.model.CalendarEventDto;

import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.data.ParserException;
import java.text.ParseException;
import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.Component;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.property.DtEnd;
import net.fortuna.ical4j.model.property.DtStart;
import net.fortuna.ical4j.model.Parameter;

@Service
public class IcsService {

    @Autowired
    private IcsRepository icsRepository;

    public Ics saveIcsLink(String userId, String icsUrl) {
        Ics ics = new Ics(userId, icsUrl);
        return icsRepository.save(ics);
    }

    public boolean isIcsLinkValid(String url) {
        try {
            HttpURLConnection connection = (HttpURLConnection) new URL(url).openConnection();
            // set request method to HEAD to avoid downloading the entire file
            connection.setRequestMethod("HEAD");
            int responseCode = connection.getResponseCode();
            return responseCode == HttpURLConnection.HTTP_OK;
        } catch (IOException e) {
            return false;
        }
    }

    public IcsStatusDto getIcsStatus(String userId) {
        Optional<Ics> icsOptional = icsRepository.findById(userId);
        IcsStatusDto status = new IcsStatusDto();

        if (icsOptional.isPresent()) {
            Ics ics = icsOptional.get();
            if (ics.getUrl().isEmpty()) {
                status.setStored(false);
                status.setValid(false);
                status.setUrl("");
            } else {
                status.setStored(true);
                status.setValid(isIcsLinkValid(ics.getUrl()));
                status.setUrl(ics.getUrl());
            }
        }
        return status;
    }

    public List<CalendarEventDto> getCalendarEvents(String userId) throws IOException, ParserException, ParseException {
        Ics ics = icsRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));

        URL url = new URL(ics.getUrl());
        URLConnection connection = url.openConnection();
        // input stream schließen !!!
        InputStream inputStream = connection.getInputStream();

        CalendarBuilder builder = new CalendarBuilder();
        Calendar calendar = builder.build(inputStream);

        // get VEVENT components out of calender and map them to CalendarEventDto
        return calendar.getComponents(Component.VEVENT).stream()
                .filter(component -> component instanceof VEvent)
                .map(VEvent -> mapToCalendarEventDto((VEvent) VEvent))
                .collect(Collectors.toList());
    }

    private CalendarEventDto mapToCalendarEventDto(VEvent event) {
        CalendarEventDto dto = new CalendarEventDto();
        dto.setTitle(event.getSummary().getValue());
        dto.setStart(event.getStartDate().getDate());
        dto.setEnd(event.getEndDate().getDate());
        dto.setAllDay(isAllDayEvent(event.getStartDate(), event.getEndDate()));

        return dto;
    }

    private boolean isAllDayEvent(DtStart start, DtEnd end) {
        return isDateParameter(start) || isDateParameter(end);
    }

    // check if the event is an all-day event by checking if the VALUE parameter is
    // set to DATE (instead of DATE-TIME)
    private boolean isDateParameter(DtStart start) {
        Parameter value = start.getParameter("VALUE");
        return value != null && "DATE".equals(value.getValue());
    }

    private boolean isDateParameter(DtEnd end) {
        Parameter value = end.getParameter("VALUE");
        return value != null && "DATE".equals(value.getValue());
    }
}
