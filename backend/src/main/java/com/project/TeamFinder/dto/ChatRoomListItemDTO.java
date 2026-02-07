package com.project.TeamFinder.dto;

public class ChatRoomListItemDTO {
    private String id;
    private Long otherUserId;
    private String otherUserName;
    private String otherUserPictureUrl;
    
    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public Long getOtherUserId() {
        return otherUserId;
    }
    public void setOtherUserId(Long otherUserId) {
        this.otherUserId = otherUserId;
    }
    public String getOtherUserName() {
        return otherUserName;
    }
    public void setOtherUserName(String otherUserName) {
        this.otherUserName = otherUserName;
    }
    public String getOtherUserPictureUrl() {
        return otherUserPictureUrl;
    }
    public void setOtherUserPictureUrl(String otherUserPictureUrl) {
        this.otherUserPictureUrl = otherUserPictureUrl;
    }
}
