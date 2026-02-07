package com.project.TeamFinder.dto;

public class ChatSendRequestDTO {
    private String chatRoomId;
    private String content;

    public String getChatRoomId() { return chatRoomId; }
    public String getContent() { return content; }

    public void setChatRoomId(String chatRoomId) { this.chatRoomId = chatRoomId; }
    public void setContent(String content) { this.content = content; }    
}

