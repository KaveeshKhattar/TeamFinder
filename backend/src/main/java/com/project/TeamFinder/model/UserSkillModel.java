package com.project.TeamFinder.model;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "user_skills")
public class UserSkillModel {

    @EmbeddedId
    private UserSkillModelEmbeddedKey userSkillModelEmbeddedKey;

    // @Column(name = "user_id", nullable = false) // Foreign key to the user table
    // private Long userId;

    // @Column(name = "skill_id", nullable = false) // Foreign key to the skills table
    // private Long skillId;

    @Column(name = "proficiency", nullable = false) // Proficiency level of the skill
    private String proficiency; // E.g., "Beginner", "Intermediate", "Expert"

    public UserSkillModelEmbeddedKey getUserSkillModelEmbeddedKey() {
        return userSkillModelEmbeddedKey;
    }

    public void setUserSkillModelEmbeddedKey(UserSkillModelEmbeddedKey userSkillModelEmbeddedKey) {
        this.userSkillModelEmbeddedKey = userSkillModelEmbeddedKey;
    }

    public String getProficiency() {
        return proficiency;
    }

    public void setProficiency(String proficiency) {
        this.proficiency = proficiency;
    }
}
