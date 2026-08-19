package com.credencify.credential_service.controller;

import com.credencify.credential_service.dto.request.CertificateRequest;
import com.credencify.credential_service.dto.response.StoreHashResponse;
import com.credencify.credential_service.dto.response.VerifyHashResponse;
import com.credencify.credential_service.entity.CertificateEntity;
import com.credencify.credential_service.enums.CertificateStatus;
import com.credencify.credential_service.respository.CertificateRepository;
import com.credencify.credential_service.service.CredentialService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;

@RestController
@RequestMapping("api/certificates")
@CrossOrigin(origins = "*")
public class CredentialController {

    private final CredentialService credentialService;
    private final CertificateRepository certificateRepository;

    public CredentialController(CredentialService credentialService,
                                 CertificateRepository certificateRepository) {
        this.credentialService = credentialService;
        this.certificateRepository = certificateRepository;
    }

    @PostMapping
    public ResponseEntity<StoreHashResponse> issueCertificate(@RequestBody CertificateRequest req) throws Exception {
        String hashed = credentialService.hash(credentialService.combineString(req));
        StoreHashResponse response = credentialService.issueCertificate(req);
        response = credentialService.saveCertificate(req, response);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping("/{certificateId}")
    public ResponseEntity<VerifyHashResponse> verify(@PathVariable String certificateId) throws Exception {
        VerifyHashResponse response = credentialService.verify(certificateId);
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }

    @GetMapping("/find/{certificateId}")
    public ResponseEntity<CertificateEntity> findCertificate(@PathVariable String certificateId) throws Exception {
        CertificateEntity certificate = credentialService.getCertificate(certificateId);
        return ResponseEntity.status(HttpStatus.OK).body(certificate);
    }

    @GetMapping("/institution/{institutionId}")
    public ResponseEntity<List<CertificateEntity>> getCertificatesByInstitution(@PathVariable String institutionId) {
        return ResponseEntity.ok(credentialService.getCertificatesByInstitution(institutionId));
    }

    @GetMapping("/learner/{learnerEmail}")
    public ResponseEntity<List<CertificateEntity>> getCertificatesByLearner(@PathVariable String learnerEmail) {
        return ResponseEntity.ok(credentialService.getCertificatesByLearner(learnerEmail));
    }

    @GetMapping("/learner/id/{learnerId}")
    public ResponseEntity<List<CertificateEntity>> getCertificatesByLearnerId(@PathVariable String learnerId) {
        return ResponseEntity.ok(credentialService.getCertificatesByLearnerId(learnerId));
    }

    @PatchMapping("/{certificateId}/revoke")
    public ResponseEntity<CertificateEntity> revokeCertificate(@PathVariable String certificateId) {
        return ResponseEntity.ok(credentialService.revokeCertificate(certificateId));
    }

    // ─── ADMIN ENDPOINTS (Real Data) ─────────────────────────────────────

    /**
     * Real-time admin overview: pulls actual counts from the certificates table.
     */
    @GetMapping("/admin/overview")
    public ResponseEntity<Map<String, Object>> getAdminOverview() {
        long totalIssued = certificateRepository.count();
        long totalRevoked = certificateRepository.countByStatus(CertificateStatus.REVOKED);
        long activeIssued = certificateRepository.countByStatus(CertificateStatus.ISSUED);

        Map<String, Object> data = new HashMap<>();
        data.put("certificatesIssued", totalIssued);
        data.put("certificatesActive", activeIssued);
        data.put("revokedCertificates", totalRevoked);
        return ResponseEntity.ok(data);
    }

    /**
     * All certificates for admin table — ordered by newest first.
     */
    @GetMapping("/admin/all")
    public ResponseEntity<List<Map<String, Object>>> getAllCertificatesAdmin() {
        List<CertificateEntity> certs = certificateRepository.findAllByOrderByCreatedAtDesc();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        List<Map<String, Object>> result = new ArrayList<>();
        for (CertificateEntity c : certs) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("certificateId", c.getCertificateId());
            row.put("learnerName", c.getLearnerName());
            row.put("institutionName", c.getInstitutionName());
            row.put("courseName", c.getCourseName());
            row.put("status", c.getStatus().name());
            row.put("issuedOn", c.getCreatedAt() != null ? c.getCreatedAt().format(fmt) : "");
            result.add(row);
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Recent 5 certificates for dashboard widget — real DB rows.
     */
    @GetMapping("/admin/recent")
    public ResponseEntity<List<Map<String, Object>>> getRecentCertificatesAdmin() {
        List<CertificateEntity> certs = certificateRepository.findTop5ByOrderByCreatedAtDesc();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        List<Map<String, Object>> result = new ArrayList<>();
        for (CertificateEntity c : certs) {
            Map<String, Object> row = new LinkedHashMap<>();
            row.put("certificateId", c.getCertificateId());
            row.put("learnerName", c.getLearnerName());
            row.put("institutionName", c.getInstitutionName());
            row.put("courseName", c.getCourseName());
            row.put("status", c.getStatus().name());
            row.put("issuedOn", c.getCreatedAt() != null ? c.getCreatedAt().format(fmt) : "");
            result.add(row);
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Top institutions leaderboard — real GROUP BY query from DB.
     */
    @GetMapping("/admin/top-institutions")
    public ResponseEntity<List<Map<String, Object>>> getTopInstitutions() {
        List<Object[]> rows = certificateRepository.findTopInstitutionsByCount();
        List<Map<String, Object>> result = new ArrayList<>();
        long maxCount = rows.isEmpty() ? 1L : (Long) rows.get(0)[1];

        int rank = 1;
        for (Object[] row : rows) {
            if (rank > 5) break;
            String name = (String) row[0];
            long count = (Long) row[1];
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("rank", rank);
            entry.put("name", name != null ? name : "Unknown");
            entry.put("count", count);
            entry.put("percentage", Math.round((double) count / maxCount * 100));
            result.add(entry);
            rank++;
        }
        return ResponseEntity.ok(result);
    }

    /**
     * All REVOKED certificates for Revocations view.
     */
    @GetMapping("/admin/revoked")
    public ResponseEntity<List<Map<String, Object>>> getRevokedCertificates() {
        List<CertificateEntity> certs = certificateRepository.findAllByOrderByCreatedAtDesc();
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM dd, yyyy");
        List<Map<String, Object>> result = new ArrayList<>();
        for (CertificateEntity c : certs) {
            if (c.getStatus() == CertificateStatus.REVOKED) {
                Map<String, Object> row = new LinkedHashMap<>();
                row.put("certificateId", c.getCertificateId());
                row.put("learnerName", c.getLearnerName());
                row.put("institutionName", c.getInstitutionName());
                row.put("courseName", c.getCourseName());
                row.put("status", "REVOKED");
                row.put("issuedOn", c.getCreatedAt() != null ? c.getCreatedAt().format(fmt) : "");
                result.add(row);
            }
        }
        return ResponseEntity.ok(result);
    }

    /**
     * Real-time chart data for certificates issued in the last 14 days.
     */
    @GetMapping("/admin/chart-data")
    public ResponseEntity<List<Map<String, Object>>> getChartData() {
        java.time.LocalDate today = java.time.LocalDate.now();
        java.time.format.DateTimeFormatter dateOnlyFmt = java.time.format.DateTimeFormatter.ofPattern("MMM dd");

        Map<String, Long> chartMap = new LinkedHashMap<>();
        for (int i = 13; i >= 0; i--) {
            chartMap.put(today.minusDays(i).format(dateOnlyFmt), 0L);
        }

        List<Object[]> rows = certificateRepository.findDailyCertificateCounts();
        java.time.format.DateTimeFormatter dbDateFmt = java.time.format.DateTimeFormatter.ofPattern("MMM dd");

        for (Object[] row : rows) {
            if (row[0] != null) {
                java.time.LocalDate dbDate;
                if (row[0] instanceof java.sql.Date) {
                    dbDate = ((java.sql.Date) row[0]).toLocalDate();
                } else if (row[0] instanceof java.time.LocalDate) {
                    dbDate = (java.time.LocalDate) row[0];
                } else {
                    continue;
                }
                String dateStr = dbDate.format(dbDateFmt);
                if (chartMap.containsKey(dateStr)) {
                    chartMap.put(dateStr, (Long) row[1]);
                }
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Map.Entry<String, Long> entry : chartMap.entrySet()) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("date", entry.getKey());
            map.put("count", entry.getValue());
            result.add(map);
        }

        return ResponseEntity.ok(result);
    }
}
