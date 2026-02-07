package com.project.TeamFinder.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.project.TeamFinder.model.ChatRoom;

@Repository
public interface ChatRoomRepository extends CrudRepository<ChatRoom, String> {

  @Query(value = """
      select *
      from chat_rooms c
      where (c.user1_id = :u1 and c.user2_id = :u2)
         or (c.user1_id = :u2 and c.user2_id = :u1)
      """, nativeQuery = true)
  Optional<ChatRoom> findRoomBetween(Long u1, Long u2);

  @Query("""
          select c
          from ChatRoom c
          where c.user1Id = :userId
             or c.user2Id = :userId
      """)
  List<ChatRoom> findAllChatRoomsByUserId(@Param("userId") Long userId);

}