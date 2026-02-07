package com.project.TeamFinder.repository;
import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.project.TeamFinder.model.Message;

@Repository
public interface MessageRepository extends CrudRepository<Message, Long> {
    
    List<Message> findByChatRoomIdOrderByTimestampAsc(String chatRoomId);
}
