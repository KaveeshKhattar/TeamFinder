package com.project.TeamFinder.dto;

import java.util.List;

import com.project.TeamFinder.model.Team;
import com.project.TeamFinder.projection.UserProjection;

public class TeamWithMembersDTO {
    private Long teamId;
    private String teamName;
    private Long eventId;
    private List<UserProjection> members;

    public Long getTeamId() {
        return teamId;
    }

    public void setTeamId(Long teamId) {
        this.teamId = teamId;
    }

    public String getTeamName() {
        return teamName;
    }

    public void setTeamName(String teamName) {
        this.teamName = teamName;
    }

    public Long getEventId() {
        return eventId;
    }

    public void setEventId(Long eventId) {
        this.eventId = eventId;
    }

    public List<UserProjection> getMembers() {
        return members;
    }

    public void setMembers(List<UserProjection> members) {
        this.members = members;
    }

    public TeamWithMembersDTO(Team team, List<UserProjection> members) {
        this.teamId = team.getId();
        this.teamName = team.getName();
        this.eventId = team.getEventId();
        this.members = members;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append("TeamWithMembersDTOFinal{")
          .append("id=").append(teamId)
          .append(", teamName='").append(teamName).append('\'')
          .append(", members=[");
    
        if (members != null && !members.isEmpty()) {
            for (UserProjection member : members) {
                sb.append("{id=").append(member.getId())
                  .append(", email='").append(member.getEmail()).append('\'')
                  .append(", pictureURL='").append(member.getPictureURL()).append('\'')
                  .append(", fullName='").append(member.getFirstName()).append('\'')
                  .append(", firstName='").append(member.getFirstName()).append('\'')
                  .append(", lastName='").append(member.getLastName()).append("'}, ");
            }
            // Remove last comma and space
            sb.setLength(sb.length() - 2); 
        } else {
            sb.append("No members");
        }
        
        sb.append("]}");
        return sb.toString();
    }
    


}
