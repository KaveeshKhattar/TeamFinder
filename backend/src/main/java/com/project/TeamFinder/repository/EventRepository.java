package com.project.TeamFinder.repository;


import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import com.project.TeamFinder.model.Event;

@Repository
public interface EventRepository extends CrudRepository<Event, Long> {
}
