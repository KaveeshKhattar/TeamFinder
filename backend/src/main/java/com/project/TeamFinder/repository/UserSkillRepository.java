package com.project.TeamFinder.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.project.TeamFinder.model.UserSkillModel;
import com.project.TeamFinder.model.UserSkillModelEmbeddedKey;

public interface UserSkillRepository extends JpaRepository<UserSkillModel, UserSkillModelEmbeddedKey> {

}