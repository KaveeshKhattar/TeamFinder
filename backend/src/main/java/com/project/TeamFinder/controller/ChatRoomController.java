package com.project.TeamFinder.controller;

import java.util.List;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.project.TeamFinder.dto.ChatRoomListItemDTO;
import com.project.TeamFinder.dto.StartChatRequestDTO;
import com.project.TeamFinder.dto.UserDTO;
import com.project.TeamFinder.model.ChatRoom;
import com.project.TeamFinder.service.ChatRoomService;
import com.project.TeamFinder.service.UserService;

@RestController
@RequestMapping("/api/chats")
public class ChatRoomController {

    private final UserService userService;
    private final ChatRoomService chatRoomService;

    public ChatRoomController(UserService userService, ChatRoomService chatRoomService) {
        this.userService = userService;
        this.chatRoomService = chatRoomService;
    }

    @PostMapping("/start")
    public ChatRoom startChat(
            @RequestBody StartChatRequestDTO req,
            @AuthenticationPrincipal UserDetails userDetails) {

        UserDTO me = userService.getProfile(userDetails.getUsername());
        System.out.println(me.getId() + " controller stuff " + req.getOtherUserId());
        ChatRoom room = chatRoomService.getOrCreateRoom(me.getId(), req.getOtherUserId());
        System.out.println(room);
        return chatRoomService.getOrCreateRoom(me.getId(), req.getOtherUserId());
    }

    @GetMapping("/my")
    public List<ChatRoomListItemDTO> myRooms(@AuthenticationPrincipal UserDetails userDetails) {

        return chatRoomService.getMyChatRooms(userDetails.getUsername());
    }

}
