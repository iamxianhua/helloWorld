package com.meetingroom.service;

import com.meetingroom.model.MeetingRoom;
import com.meetingroom.repository.MeetingRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class MeetingRoomService {

    @Autowired
    private MeetingRoomRepository roomRepository;

    public List<MeetingRoom> getAllRooms() {
        return roomRepository.findAll();
    }

    public List<MeetingRoom> getAvailableRooms() {
        return roomRepository.findByAvailable(true);
    }

    public Optional<MeetingRoom> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    public MeetingRoom createRoom(MeetingRoom room) {
        return roomRepository.save(room);
    }

    public MeetingRoom updateRoom(Long id, MeetingRoom roomDetails) {
        MeetingRoom room = roomRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Room not found"));

        room.setRoomName(roomDetails.getRoomName());
        room.setCapacity(roomDetails.getCapacity());
        room.setLocation(roomDetails.getLocation());
        room.setFacilities(roomDetails.getFacilities());
        room.setAvailable(roomDetails.getAvailable());
        room.setDescription(roomDetails.getDescription());

        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }
}
