package com.stroodle.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PollService {
    @Autowired
    private PollRepository pollRepository;

    // Methoden zur Verwaltung von Umfragen
}
