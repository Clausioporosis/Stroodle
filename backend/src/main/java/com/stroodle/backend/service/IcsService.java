package com.stroodle.backend.service;

import java.io.IOException;
import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.stroodle.backend.repository.IcsRepository;

import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.model.component.VEvent;
import net.fortuna.ical4j.model.property.DtEnd;
import net.fortuna.ical4j.model.property.DtStart;

import com.stroodle.backend.model.Ics;
import com.stroodle.backend.model.IcsStatusDto;

import net.fortuna.ical4j.data.ParserException;

import com.stroodle.backend.model.CalendarEventDto;
import java.text.ParseException;
import java.util.List;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.io.InputStream;
import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.Component;
import java.util.Optional;
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
            status.setStored(true);
            status.setValid(isIcsLinkValid(ics.getUrl()));
            status.setUrl(ics.getUrl());
        } else {
            status.setStored(false);
            status.setValid(false);
        }
        return status;
    }

    public List<CalendarEventDto> getCalendarEvents(String userId) throws IOException, ParserException, ParseException {
        Ics ics = icsRepository.findById(userId).orElseThrow(() -> new IllegalArgumentException("Invalid user ID"));
        URL url = new URL(ics.getUrl());

        URLConnection conn = url.openConnection();
        InputStream is = conn.getInputStream();

        CalendarBuilder builder = new CalendarBuilder();
        Calendar calendar = builder.build(is);

        List<CalendarEventDto> events = new ArrayList<>();
        for (Component component : calendar.getComponents()) {
            if (component instanceof VEvent) {
                VEvent event = (VEvent) component;
                CalendarEventDto dto = new CalendarEventDto();
                dto.setTitle(event.getSummary().getValue());
                dto.setStart(event.getStartDate().getDate());
                dto.setEnd(event.getEndDate().getDate());
                boolean isAllDay = isAllDayEvent(event.getStartDate(), event.getEndDate());
                dto.setAllDay(isAllDay);

                events.add(dto);
            }
        }

        return events;
    }

    private boolean isAllDayEvent(DtStart start, DtEnd end) {
        Parameter startValue = start.getParameter("VALUE");
        if (startValue != null && "DATE".equals(startValue.getValue())) {
            return true;
        }
        Parameter endValue = end.getParameter("VALUE");
        return endValue != null && "DATE".equals(endValue.getValue());
    }
}