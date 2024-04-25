package com.stroodle.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/polls")
public class PollController {
    @Autowired
    private PollService pollService;

    // HTTP-Methoden für Umfrage-Ressourcen
}
