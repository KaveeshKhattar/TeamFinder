package com.project.TeamFinder.model;

import java.io.Serializable;
import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class UserSkillModelEmbeddedKey implements Serializable {
    
    @Column(name = "user_id", nullable = false)
    private Long user_id;

    @Column(name = "skill_id", nullable = false)
    private Long skill_id;   

    // Default constructor
    public UserSkillModelEmbeddedKey() {
    }

    // Parameterized constructor
    public UserSkillModelEmbeddedKey(Long userId, Long skillId) {
        this.user_id = userId;
        this.skill_id = skillId;
    }

    // Getters and Setters
    public Long getUserId() {
        return user_id;
    }

    public void setUserId(Long userId) {
        this.user_id = userId;
    }

    public Long getSkillId() {
        return skill_id;
    }

    public void setSkillId(Long skillId) {
        this.skill_id = skillId;
    }

    // Override equals() and hashCode() to ensure proper composite key handling
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        UserSkillModelEmbeddedKey that = (UserSkillModelEmbeddedKey) o;
        return Objects.equals(user_id, that.user_id) && Objects.equals(skill_id, that.skill_id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(user_id, skill_id);
    }
}