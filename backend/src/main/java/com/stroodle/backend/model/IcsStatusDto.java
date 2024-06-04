package com.stroodle.backend.model;

import lombok.Data;

@Data
public class IcsStatusDto {
    private boolean isStored;
    private boolean isValid;
    private String url;
}
