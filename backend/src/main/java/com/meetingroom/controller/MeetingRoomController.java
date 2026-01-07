package com.meetingroom.controller;

import com.meetingroom.model.MeetingRoom;
import com.meetingroom.service.MeetingRoomService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*")
public class MeetingRoomController {

    @Autowired
    private MeetingRoomService roomService;

    @GetMapping
    public ResponseEntity<List<MeetingRoom>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @GetMapping("/available")
    public ResponseEntity<List<MeetingRoom>> getAvailableRooms() {
        return ResponseEntity.ok(roomService.getAvailableRooms());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MeetingRoom> getRoomById(@PathVariable Long id) {
        return roomService.getRoomById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<MeetingRoom> createRoom(@RequestBody MeetingRoom room) {
        try {
            MeetingRoom created = roomService.createRoom(room);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<MeetingRoom> updateRoom(@PathVariable Long id, @RequestBody MeetingRoom room) {
        try {
            MeetingRoom updated = roomService.updateRoom(id, room);
            return ResponseEntity.ok(updated);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRoom(@PathVariable Long id) {
        try {
            roomService.deleteRoom(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
