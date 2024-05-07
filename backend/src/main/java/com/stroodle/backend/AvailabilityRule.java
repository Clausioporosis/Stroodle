package com.stroodle.backend;

public class AvailabilityRule {
    private String dayOfWeek; // z.B. "Monday", "Tuesday", etc.
    private String startTime; // z.B. "09:00"
    private String endTime; // z.B. "17:00"
    private boolean available; // true für verfügbar, false für nicht verfügbar

    // Constructors
    public AvailabilityRule() {
    }

    public AvailabilityRule(String dayOfWeek, String startTime, String endTime, boolean available) {
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
        this.available = available;
    }

    // Getter and Setter methods
    public String getDayOfWeek() {
        return dayOfWeek;
    }

    public void setDayOfWeek(String dayOfWeek) {
        this.dayOfWeek = dayOfWeek;
    }

    public String getStartTime() {
        return startTime;
    }

    public void setStartTime(String startTime) {
        this.startTime = startTime;
    }

    public String getEndTime() {
        return endTime;
    }

    public void setEndTime(String endTime) {
        this.endTime = endTime;
    }

    public boolean isAvailable() {
        return available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    // toString-Methode für Debugging-Zwecke
    @Override
    public String toString() {
        return "AvailabilityRule{" +
                "dayOfWeek='" + dayOfWeek + '\'' +
                ", startTime='" + startTime + '\'' +
                ", endTime='" + endTime + '\'' +
                ", available=" + available +
                '}';
    }
}
