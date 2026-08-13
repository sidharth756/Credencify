package com.credencify.auth_service.controller;

import com.credencify.auth_service.entity.LearnerEntity;
import com.credencify.auth_service.service.LearnerService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1.0/learners")
public class LearnerController {

    private final LearnerService learnerService;

    public LearnerController(LearnerService learnerService) {
        this.learnerService = learnerService;
    }

    @GetMapping
    public ResponseEntity<List<LearnerEntity>> getAllLearners() {

        List<LearnerEntity> learners =
                learnerService.getAllLearners();

        return ResponseEntity.ok(learners);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<LearnerEntity> getLearnerByUserId(
            @PathVariable String userId) {

        LearnerEntity learner =
                learnerService.getLearnerByUserId(userId);

        if (learner == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(learner);
    }

    @PostMapping
    public ResponseEntity<LearnerEntity> saveLearner (@RequestBody LearnerEntity learner) {

        LearnerEntity savedLearner = new LearnerEntity();
        savedLearner.setUserId(learner.getUserId());

        learnerService.saveLearner(learner);

        return ResponseEntity.ok(savedLearner);
    }
}