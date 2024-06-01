package com.stroodle.backend.model;

import org.springframework.data.annotation.Id;
import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Ics {
    @Id
    private String userId;
    private String url;
}
