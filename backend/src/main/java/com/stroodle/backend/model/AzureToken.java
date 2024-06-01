package com.stroodle.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import lombok.*;

import java.time.Instant;

@Document(collection = "outlook_token")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AzureToken {
    @Id
    private String userId;
    private String accessToken;
    private Instant expiresAt;
}