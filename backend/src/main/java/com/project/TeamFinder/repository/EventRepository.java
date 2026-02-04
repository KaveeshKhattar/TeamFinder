package com.project.TeamFinder.repository;


import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.project.TeamFinder.model.Event;

@Repository
public interface EventRepository extends CrudRepository<Event, Long> {
    // List<Event> findByCollegeId(Long id);

    // @Modifying
    // @Transactional
    // @Query(value = "INSERT INTO events (college_id, name, date, venue, team_size, description) VALUES (:collegeId, :eventName, to_timestamp(:eventDate || ' ' || :eventTime, 'YYYY-MM-DD HH24:MI:SS'), :eventVenue, :teamSize, :eventDescription)", nativeQuery = true)
    // void createEvent(@Param("collegeId") Long collegeId, @Param("eventName") String eventName, @Param("eventDate") String eventDate, @Param("eventTime") String eventTime, @Param("eventVenue") String eventVenue, @Param("teamSize") Long teamSize, @Param("eventDescription") String eventDescription);

    // @Modifying
    // @Transactional
    // @Query(value = "UPDATE events SET name = :eventName, date = to_timestamp(:eventDate || ' ' || :eventTime, 'YYYY-MM-DD HH24:MI:SS'), venue = :eventVenue, team_size = :teamSize, description = :eventDescription WHERE id = :eventId ", nativeQuery = true)
    // void updateEvent(
    //     @Param("eventId") Long eventId, @Param("eventName") String eventName, @Param("eventDate") String eventDate, @Param("eventTime") String eventTime, @Param("eventVenue") String eventVenue, @Param("teamSize") Long teamSize, @Param("eventDescription") String eventDescription
    //     );
}
