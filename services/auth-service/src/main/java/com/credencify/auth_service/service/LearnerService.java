package com.credencify.auth_service.service;

import com.credencify.auth_service.entity.LearnerEntity;

import java.util.List;

public interface LearnerService {

    List<LearnerEntity> getAllLearners();

    LearnerEntity getLearnerByUserId(String userId);

    LearnerEntity saveLearner(LearnerEntity learner);
}