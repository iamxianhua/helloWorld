package com.meetingroom.service;

import com.meetingroom.model.Booking;
import com.meetingroom.model.MeetingRoom;
import com.meetingroom.repository.BookingRepository;
import com.meetingroom.repository.MeetingRoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private MeetingRoomRepository roomRepository;

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public List<Booking> getBookingsByEmail(String email) {
        return bookingRepository.findByUserEmail(email);
    }

    public List<Booking> getBookingsByRoom(Long roomId) {
        MeetingRoom room = roomRepository.findById(roomId)
            .orElseThrow(() -> new RuntimeException("Room not found"));
        return bookingRepository.findByMeetingRoom(room);
    }

    public Booking createBooking(Booking booking) {
        List<Booking> conflicts = bookingRepository.findConflictingBookings(
            booking.getMeetingRoom().getId(),
            booking.getStartTime(),
            booking.getEndTime()
        );

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Time slot is already booked");
        }

        if (booking.getStartTime().isAfter(booking.getEndTime())) {
            throw new RuntimeException("Start time must be before end time");
        }

        return bookingRepository.save(booking);
    }

    public Booking updateBooking(Long id, Booking bookingDetails) {
        Booking booking = bookingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Booking not found"));

        List<Booking> conflicts = bookingRepository.findConflictingBookings(
            bookingDetails.getMeetingRoom().getId(),
            bookingDetails.getStartTime(),
            bookingDetails.getEndTime()
        );

        conflicts.removeIf(b -> b.getId().equals(id));

        if (!conflicts.isEmpty()) {
            throw new RuntimeException("Time slot is already booked");
        }

        booking.setMeetingRoom(bookingDetails.getMeetingRoom());
        booking.setStartTime(bookingDetails.getStartTime());
        booking.setEndTime(bookingDetails.getEndTime());
        booking.setPurpose(bookingDetails.getPurpose());
        booking.setStatus(bookingDetails.getStatus());

        return bookingRepository.save(booking);
    }

    public void deleteBooking(Long id) {
        bookingRepository.deleteById(id);
    }
}
