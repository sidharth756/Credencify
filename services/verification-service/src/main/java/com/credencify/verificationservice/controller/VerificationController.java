package com.credencify.verificationservice.controller;

import com.credencify.verificationservice.dto.response.AiAuditResponse;
import com.credencify.verificationservice.dto.response.VerifyHashResponse;
import com.credencify.verificationservice.service.VerificationService;
import com.credencify.verificationservice.entity.VerificationLog;
import com.credencify.verificationservice.entity.AuditLog;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api/v1.0/verify")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class VerificationController {

    private final VerificationService verificationService;

    // Service health endpoints — actual running ports
    private static final Map<String, String> SERVICE_HEALTH_URLS = new LinkedHashMap<>();
    static {
        SERVICE_HEALTH_URLS.put("API Gateway",           "http://localhost:9000/actuator/health");
        SERVICE_HEALTH_URLS.put("Auth Service",          "http://localhost:8060/api/v1.0/actuator/health");
        SERVICE_HEALTH_URLS.put("Certificate Service",   "http://localhost:8051/actuator/health");
        SERVICE_HEALTH_URLS.put("Verification Service",  "http://localhost:8053/actuator/health");
        SERVICE_HEALTH_URLS.put("Blockchain Service",    "http://localhost:8052/actuator/health");
        SERVICE_HEALTH_URLS.put("Eureka Server",         "http://localhost:8761/actuator/health");
        SERVICE_HEALTH_URLS.put("Database (MySQL)",      "http://localhost:8060/api/v1.0/actuator/health"); // auth-service DB check
    }

    @GetMapping("/{certificateId}")
    public ResponseEntity<VerifyHashResponse> verifyCertificate(@PathVariable String certificateId) throws Exception {
        VerifyHashResponse response = verificationService.verify(certificateId);
        return ResponseEntity.ok(response);
    }

    /**
     * Real system health: pings each microservice's /actuator/health endpoint via HTTP.
     * Returns "UP" / "DOWN" based on whether the service responds 200 OK.
     */
    @GetMapping("/system-health")
    public ResponseEntity<List<Map<String, String>>> getSystemHealth() {
        RestTemplate restTemplate = new RestTemplate();
        List<Map<String, String>> healthList = new ArrayList<>();

        for (Map.Entry<String, String> entry : SERVICE_HEALTH_URLS.entrySet()) {
            String name = entry.getKey();
            String url  = entry.getValue();
            String status = "Down";

            try {
                ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
                if (response.getStatusCode().is2xxSuccessful()) {
                    Map<?, ?> body = response.getBody();
                    if (name.equalsIgnoreCase("Database (MySQL)")) {
                        if (body != null && body.containsKey("components")) {
                            Map<?, ?> components = (Map<?, ?>) body.get("components");
                            if (components != null && components.containsKey("db")) {
                                Map<?, ?> db = (Map<?, ?>) components.get("db");
                                String dbStatus = db != null ? String.valueOf(db.get("status")) : "UP";
                                status = "UP".equalsIgnoreCase(dbStatus) ? "Healthy" : "Down";
                            } else {
                                status = "Healthy";
                            }
                        } else {
                            status = "Healthy";
                        }
                    } else {
                        String actuatorStatus = body != null ? String.valueOf(body.get("status")) : "UP";
                        status = "UP".equalsIgnoreCase(actuatorStatus) ? "Healthy" : "Degraded";
                    }
                }
            } catch (Exception e) {
                System.err.println("ERROR PINGING " + name + " AT URL: " + url);
                e.printStackTrace();
                status = "Down";
            }

            Map<String, String> row = new LinkedHashMap<>();
            row.put("name", name);
            row.put("status", status);
            healthList.add(row);
        }

        return ResponseEntity.ok(healthList);
    }

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getVerificationSummary() {
        Map<String, Object> summary = new HashMap<>();
        summary.put("total", 0);
        summary.put("verificationsGrowth", "Real-time");
        summary.put("mismatchReports", 0);
        summary.put("mismatchGrowth", "0");
        return ResponseEntity.ok(summary);
    }

    @GetMapping("/mismatch-reports")
    public ResponseEntity<List<Map<String, Object>>> getMismatchReports() {
        // No mismatch log table yet — return empty list (no fake data)
        return ResponseEntity.ok(new ArrayList<>());
    }

    @PostMapping("/ai-audit")
    public ResponseEntity<AiAuditResponse> auditCertificate(
            @RequestParam("file") MultipartFile file,
            @RequestParam(value = "expectedCertificateId", required = false) String expectedCertificateId) throws Exception {
        return ResponseEntity.ok(verificationService.auditDocument(file, expectedCertificateId));
    }

    @GetMapping("/logs")
    public ResponseEntity<List<VerificationLog>> getVerificationLogs() throws Exception {
        return ResponseEntity.ok(verificationService.getVerificationLogs());
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() throws Exception {
        return ResponseEntity.ok(verificationService.getAuditLogs());
    }
}
