package com.meetingroom.repository;

import com.meetingroom.model.Booking;
import com.meetingroom.model.MeetingRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserEmail(String userEmail);

    List<Booking> findByMeetingRoom(MeetingRoom meetingRoom);

    @Query("SELECT b FROM Booking b WHERE b.meetingRoom.id = :roomId AND " +
           "((b.startTime < :endTime AND b.endTime > :startTime))")
    List<Booking> findConflictingBookings(Long roomId, LocalDateTime startTime, LocalDateTime endTime);
}
