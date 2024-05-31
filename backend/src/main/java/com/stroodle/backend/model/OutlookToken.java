package com.stroodle.backend.model;

import jakarta.persistence.*;
import java.time.Instant;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OutlookToken {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String userId;
    private String accessToken;
    private String refreshToken;
    private Instant expiresAt;
}