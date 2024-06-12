package com.stroodle.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import com.stroodle.backend.service.EmailService;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
@RequestMapping("/api/email")
public class EmailController {

    @Autowired
    private EmailService emailService;
    @Value("${email.default-recipient}")
    private String defaultRecipient;

    @GetMapping("/send")
    @ResponseStatus(HttpStatus.OK)
    public String sendEmail() {

        emailService.sendSimpleMessage(defaultRecipient,"Test Email", "this a Test Email");
        return "Email sent successfully";
    }


}
