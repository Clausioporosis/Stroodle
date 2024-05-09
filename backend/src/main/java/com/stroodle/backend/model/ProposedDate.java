package com.stroodle.backend.model;

import java.util.Date;
import java.util.List;

public class ProposedDate {
    private Date date;
    private String duration;
    private List<String> voterIds;

    public ProposedDate(Date date, String duration, List<String> voterIds) {
        this.date = date;
        this.duration = duration;
        this.voterIds = voterIds;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public List<String> getVoterIds() {
        return voterIds;
    }

    public void setVoterIds(List<String> voterIds) {
        this.voterIds = voterIds;
    }
}
