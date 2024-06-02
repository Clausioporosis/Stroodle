package com.stroodle.backend.model;

import org.springframework.data.annotation.Id;
import lombok.*;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AzureToken {
    @Id
    private String userId;
    private String accessToken;
    private Instant expiresAt;
}