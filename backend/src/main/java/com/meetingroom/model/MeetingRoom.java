package com.meetingroom.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "meeting_rooms")
@Data
public class MeetingRoom {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String roomName;

    @Column(nullable = false)
    private Integer capacity;

    private String location;

    private String facilities;

    @Column(nullable = false)
    private Boolean available = true;

    private String description;
}
