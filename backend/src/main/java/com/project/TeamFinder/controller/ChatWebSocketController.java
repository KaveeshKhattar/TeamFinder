package com.project.TeamFinder.controller;

import java.security.Principal;
import java.time.Instant;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import com.project.TeamFinder.dto.ChatSendRequestDTO;
import com.project.TeamFinder.model.Message;
import com.project.TeamFinder.model.User;
import com.project.TeamFinder.repository.MessageRepository;

@Controller
public class ChatWebSocketController {
    
    private final MessageRepository messageRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatWebSocketController(MessageRepository messageRepository, SimpMessagingTemplate messagingTemplate) {
            this.messageRepository = messageRepository;
            this.messagingTemplate = messagingTemplate;
}

    @MessageMapping("/chat.send")
    public void send(
            ChatSendRequestDTO req,
                Principal principal) {

        Authentication authentication = (Authentication) principal;
        User user = (User) authentication.getPrincipal();

        Message m = new Message();
        m.setChatRoomId(req.getChatRoomId());
        m.setSenderId(user.getId());
        m.setSenderName(user.getFirstName() + " " + user.getLastName());
        m.setContent(req.getContent());
        m.setTimestamp(Instant.now());

        Message saved = messageRepository.save(m);

        messagingTemplate.convertAndSend(
                "/topic/chat." + req.getChatRoomId(),
                saved);
    }

}
