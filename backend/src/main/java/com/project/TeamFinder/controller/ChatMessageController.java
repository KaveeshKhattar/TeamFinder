package com.project.TeamFinder.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.TeamFinder.model.Message;
import com.project.TeamFinder.repository.MessageRepository;

@RestController
@RequestMapping("/api/chats")
public class ChatMessageController {

    private final MessageRepository messageRepository;

    public ChatMessageController(MessageRepository messageRepository) {
        this.messageRepository = messageRepository;
    }

    @GetMapping("/{roomId}/messages")
    public List<Message> getMessages(@PathVariable String roomId) {
        System.out.println("Searching for messages: for : " + roomId);
        return messageRepository
                .findByChatRoomIdOrderByTimestampAsc(roomId);
    }
}
