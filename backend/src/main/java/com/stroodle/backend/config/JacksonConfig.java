package com.stroodle.backend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        // Registrierung des JavaTimeModule, um Java 8 Date/Time API zu unterstützen
        mapper.registerModule(new JavaTimeModule());
        return mapper;
    }
}