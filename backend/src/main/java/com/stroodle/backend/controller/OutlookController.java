package com.stroodle.backend.controller;

import com.microsoft.aad.msal4j.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpSession;
import java.net.URI;
import java.util.Collections;
import java.util.concurrent.CompletableFuture;

@RestController
@RequestMapping("/api/outlook")
public class OutlookController {

}
