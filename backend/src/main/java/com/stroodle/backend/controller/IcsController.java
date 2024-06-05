package com.stroodle.backend.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.stroodle.backend.model.Ics;
import com.stroodle.backend.model.IcsStatusDto;
import com.stroodle.backend.service.IcsService;

import net.fortuna.ical4j.data.ParserException;
import com.stroodle.backend.model.CalendarEventDto;
import java.text.ParseException;
import java.util.List;

@RestController
@RequestMapping("/api/ics")
public class IcsController {

    @Autowired
    private IcsService icsService;

    private String getUserIdFromToken() {
        JwtAuthenticationToken authentication = (JwtAuthenticationToken) SecurityContextHolder.getContext()
                .getAuthentication();
        return (String) authentication.getToken().getClaims().get("sub");
    }

    @PostMapping("/save")
    public ResponseEntity<Ics> saveIcsLink(@RequestBody Ics icsLink) {
        String userId = getUserIdFromToken();
        Ics savedLink = icsService.saveIcsLink(userId, icsLink.getUrl());
        return new ResponseEntity<>(savedLink, HttpStatus.CREATED);
    }

    @GetMapping("/events")
    public ResponseEntity<List<CalendarEventDto>> getCalendarEvents()
            throws IOException, ParserException, ParseException {
        String userId = getUserIdFromToken();
        List<CalendarEventDto> events = icsService.getCalendarEvents(userId);
        return ResponseEntity.ok(events);
    }

    @GetMapping("/status")
    public ResponseEntity<IcsStatusDto> checkIcsStatus() {
        String userId = getUserIdFromToken();
        IcsStatusDto status = icsService.getIcsStatus(userId);
        return ResponseEntity.ok(status);
    }
}
