package com.project.TeamFinder.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.project.TeamFinder.dto.ChatRoomListItemDTO;
import com.project.TeamFinder.model.ChatRoom;
import com.project.TeamFinder.model.User;
import com.project.TeamFinder.repository.ChatRoomRepository;
import com.project.TeamFinder.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class ChatRoomService {
    
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    public ChatRoomService(ChatRoomRepository chatRoomRepository, UserRepository userRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.userRepository = userRepository;
    }

    public List<ChatRoomListItemDTO> getMyChatRooms(String myEmail) {

        User me = userRepository.findByEmail(myEmail)
                .orElseThrow();
    
        List<ChatRoom> rooms =
                chatRoomRepository.findAllChatRoomsByUserId(me.getId());
    
        List<ChatRoomListItemDTO> result = new ArrayList<ChatRoomListItemDTO>();
    
        for (ChatRoom room : rooms) {

            Long otherUserId;

            if (room.getUser1Id().equals(me.getId())) {
                otherUserId = room.getUser2Id();
            } else {
                otherUserId = room.getUser1Id();
            }

            User other = userRepository.findById(otherUserId)
                    .orElseThrow();

            ChatRoomListItemDTO dto = new ChatRoomListItemDTO();
            dto.setId(room.getId());
            dto.setOtherUserName(
                    other.getFirstName() + " " + other.getLastName()
            );
            dto.setOtherUserId(other.getId());
            dto.setOtherUserPictureUrl(other.getPictureURL());

            result.add(dto);
        }

        return result;
    }

    @Transactional
    public ChatRoom getOrCreateRoom(Long me, Long other) {
        System.out.println("me: " + me + " " + me.getClass().getSimpleName());
        System.out.println("other: " + other + " " + other.getClass().getSimpleName());


        return chatRoomRepository.findRoomBetween(me, other)
                .orElseGet(() -> {
                    ChatRoom room = new ChatRoom();
                    room.setId(UUID.randomUUID().toString());
                    room.setUser1Id(me);
                    room.setUser2Id(other);
                    return chatRoomRepository.save(room);
                });
    }
    
}
