package com.stroodle.backend.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthConverter jwtAuthConverter;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
                http
                                .csrf(csrf -> csrf.disable())
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/swagger-ui/**",
                                                                "/swagger-ui.html",
                                                                "/swagger-ui/index.html",
                                                                "/swagger-resources/**",
                                                                "/v3/api-docs/**",
                                                                "/v2/api-docs",
                                                                "/webjars/**",
                                                                "/configuration/ui",
                                                                "/configuration/security")
                                                .permitAll()
                                                .anyRequest().authenticated())

                                .oauth2ResourceServer(oauth2 -> oauth2
                                                .jwt()
                                                .jwtAuthenticationConverter(jwtAuthConverter))
                                .sessionManagement(management -> management
                                                .sessionCreationPolicy(STATELESS));

                return http.build();
        }
}
