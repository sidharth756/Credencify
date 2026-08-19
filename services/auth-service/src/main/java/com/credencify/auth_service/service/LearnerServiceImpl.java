package com.credencify.auth_service.service;

import com.credencify.auth_service.entity.LearnerEntity;
import com.credencify.auth_service.repository.LearnerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LearnerServiceImpl implements LearnerService {

    private final LearnerRepository learnerRepository;

    public LearnerServiceImpl(LearnerRepository learnerRepository) {
        this.learnerRepository = learnerRepository;
    }

    @Override
    public List<LearnerEntity> getAllLearners() {
        return learnerRepository.findAll();
    }

    @Override
    public LearnerEntity getLearnerByUserId(String userId) {
        return learnerRepository.findByUserId(userId)
                .orElse(null);
    }

    @Override
    public LearnerEntity saveLearner(LearnerEntity learner) {
        return learnerRepository.save(learner);
    }
}