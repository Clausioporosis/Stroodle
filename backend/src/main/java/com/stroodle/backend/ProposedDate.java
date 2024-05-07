package com.stroodle.backend;

import java.util.Date;
import java.util.List;

public class ProposedDate {
    private Date date;
    private List<String> voterIds;

    public ProposedDate(Date date, List<String> voterIds) {
        this.date = date;
        this.voterIds = voterIds;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public List<String> getVoterIds() {
        return voterIds;
    }

    public void setVoterIds(List<String> voterIds) {
        this.voterIds = voterIds;
    }
}
