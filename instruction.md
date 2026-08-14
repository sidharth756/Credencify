# Credencify — Project Development Instructions

## 1. Purpose

Credencify is a blockchain-backed certificate issuance and verification platform.

Core principle:

> Keep certificate information off-chain and use blockchain only as an immutable cryptographic proof layer.

The system should support authenticated institutions issuing certificates and third parties verifying them through multiple verification methods.

---

## 2. Existing Architecture — Preserve It

The project already has a working foundation. Before changing anything:

1. Inspect the existing codebase.
2. Understand the current services, APIs, entities, repositories, Feign clients, Web3j integration, frontend, and database.
3. Reuse working components.
4. Do not rewrite or migrate working architecture without a concrete technical reason.
5. Add missing functionality incrementally.

Existing infrastructure:

- API Gateway
- Eureka Service Discovery
- Auth Service
- Certificate/Credential Service
- Blockchain Service
- OpenFeign
- Web3j
- Solidity smart contract
- Ethereum Sepolia
- React frontend
- MySQL

---

# 3. Service Boundaries

## Auth Service

Responsible for:

- Institution registration
- Institution/user authentication
- JWT/access tokens
- Roles
- Authorization
- Institution API access control
- Admin access through roles

Do not put certificate business logic here.

---

## Certificate Service

Main certificate business service.

Responsible for:

- Certificate issuance
- Certificate retrieval
- Certificate data
- SHA-256 generation
- Canonical certificate representation
- Certificate lifecycle/status
- Certificate DB
- Calling Blockchain Service through OpenFeign
- Storing certificate hash
- Storing blockchain transaction hash
- Future QR verification URL generation

Current certificate data includes:

- certificateId
- learnerName
- courseName
- institutionName
- certificateHash
- transactionHash
- status
- createdAt

Certificate status:

- ISSUED
- PENDING
- REVOKED
- NOT_VALID

Do not add fields unless there is a clear requirement.

---

## Blockchain Service

Responsible ONLY for blockchain/Web3 operations.

Responsible for:

- Web3j
- Smart contract interaction
- Storing certificate hash
- Retrieving certificate hash
- Blockchain transaction handling
- Transaction hash
- Contract communication

Blockchain must NOT store:

- learner name
- course name
- institution name
- grades
- raw certificate information

Only proof-related information such as:

- certificateId
- certificateHash
- timestamp

should be stored on-chain.

The existing Web3j approach is already understood and working. Do not introduce unnecessary abstractions or rewrite it without a strong reason.

---

## Verification Service

Create a dedicated Verification Service for verification business logic.

It must NOT directly access Certificate DB.

It should communicate independently with:

- Certificate Service
- Blockchain Service

Preferred structure:

    Verification Service
       ├──> Certificate Service
       └──> Blockchain Service

Avoid:

    Verification Service
       └──> Certificate Service
                └──> Blockchain Service

The second approach unnecessarily chains services.

Verification Service owns the verification decision/workflow.

---

# 4. Certificate Issuance Workflow

Expected flow:

    Institution
        ↓
    Authenticated request
        ↓
    Certificate Service
        ↓
    Validate request
        ↓
    Canonicalize certificate fields
        ↓
    Generate SHA-256
        ↓
    Call Blockchain Service through Feign
        ↓
    Blockchain Service
        ↓
    Web3j
        ↓
    Solidity Smart Contract
        ↓
    Ethereum Sepolia
        ↓
    Return transaction hash
        ↓
    Certificate Service
        ↓
    Store certificate record in Certificate DB
        ↓
    Status = ISSUED
        ↓
    Return response to Institution

If blockchain storage fails, do not mark the certificate as successfully issued.

Use PENDING or appropriate failure handling where required.

Do not confuse operational blockchain/network failures with an invalid certificate.

---

# 5. Hashing Rules

Hash generation must be deterministic.

Use a clearly defined canonical representation of certificate fields before SHA-256 generation.

The same logical certificate data must always produce the same hash.

At issuance:

    Certificate data
          ↓
    Canonical representation
          ↓
        SHA-256
          ↓
       Hash
       /   \
      ↓     ↓
 Certificate Blockchain
    DB       proof

The DB hash and blockchain hash do not need to be compared immediately after issuance simply because both were written from the same generated hash.

They become useful for integrity verification later.

Do not change canonicalization rules casually after certificates have already been issued.

---

# 6. Basic Verification API

Verification Service should expose an API similar to:

    GET /api/v1.0/verify/{certificateId}

Example:

    GET /api/v1.0/verify/CRT100

Internal flow:

    Verification Controller
            ↓
    Verification Service
       ┌────┴────┐
       ↓         ↓
    Certificate Blockchain
      Service     Service
       ↓              ↓
    Certificate    Smart Contract
       DB              ↓
       │          Blockchain Hash
       └────┬─────────┘
            ↓
       Verification Logic
            ↓
      Verification Result

The Verification Service should not access another service's database directly.

---

# 7. Basic Verification Logic

For simple Certificate-ID verification:

1. Receive certificate ID.
2. Get certificate record/hash from Certificate Service.
3. Get blockchain hash from Blockchain Service.
4. Check certificate status.
5. Compare the relevant proof/hash values.
6. Return a clear verification result.

Example:

    Hash matches + status ISSUED
        → VERIFIED

    Hash mismatch
        → INVALID / MISMATCH

    Status REVOKED
        → REVOKED

A timeout, blockchain outage, or service failure is NOT automatically evidence that a certificate is fake.

Return an appropriate operational error instead.

---

# 8. QR Verification

Future QR workflow:

    Certificate
        ↓
    QR Code
        ↓
    Verification URL
        ↓
    Verification Service
        ↓
    Certificate Service + Blockchain Service
        ↓
    Verification Result

QR should contain a verification identifier/URL rather than sensitive certificate data.

The institution will eventually receive the QR/verification information from the issuance workflow and place it on the certificate.

---

# 9. Certificate-ID Verification

A verifier should be able to enter a certificate ID manually.

Example:

    CRT100

The system retrieves certificate information and blockchain proof.

The verification page should display only the necessary information for manual comparison with the physical certificate.

Example result:

    Certificate ID: CRT100
    Learner: John Doe
    Course: Java Development
    Institution: ABC University

    Blockchain Proof: Valid
    Certificate Status: ISSUED

    Result: VERIFIED

---

# 10. Future Full Document Verification

Future advanced flow:

    Certificate Image/PDF
            ↓
           OCR
            ↓
      Extracted Text
            ↓
    AI-assisted extraction
            ↓
      Structured JSON
            ↓
    Normalization
            ↓
    Comparison / Risk Analysis
            ↓
      Verification Result

Example structured data:

    {
      "certificateId": "CRT100",
      "learnerName": "John Doe",
      "courseName": "Java Development",
      "institutionName": "ABC University",
      "grade": "A"
    }

OCR must be treated as imperfect.

Real-world scanning can introduce:

- Blur
- Skew
- Shadows
- Low resolution
- Character confusion
- Missing characters
- OCR errors

Never use:

    OCR mismatch = fake

as the entire verification rule.

---

# 11. AI-Assisted Verification

The advanced system should use a hybrid approach.

Preferred concept:

    Scanned Certificate
            ↓
           OCR
            ↓
    Structured Fields
            ↓
       Normalization
            ↓
    Deterministic comparison
            +
      Fuzzy similarity
            +
     AI-assisted analysis
            ↓
        Risk Score
            ↓
    Explainable Result

AI should assist with imperfect extraction and comparison.

It must not blindly become the sole authority.

Risk results should be explainable.

Example:

    Risk Score: 8%

    Certificate ID: Exact match
    Learner Name: High similarity
    Course: Exact match
    Institution: Exact match
    Grade: Exact match

    Result: LOW RISK

Another example:

    Risk Score: 91%

    Certificate ID: Match
    Learner Name: Mismatch
    Course: Mismatch
    Institution: Match

    Result: HIGH RISK

Avoid AI hallucinations. Base final decisions on actual extracted and stored information.

---

# 12. Future Revocation

Institutions should eventually be able to revoke certificates.

Example API:

    PATCH /api/v1.0/certificates/{certificateId}/revoke

Flow:

    Institution
        ↓
    Authenticated request
        ↓
    Certificate Service
        ↓
    Validate institution authorization
        ↓
    Status = REVOKED

Do not modify the original certificate hash merely to represent revocation.

If on-chain revocation is eventually required, design it separately and deliberately.

---

# 13. Future Mismatch Reporting

A verifier should eventually be able to report suspicious differences.

Example:

    Verifier
        ↓
    Report Mismatch
        ↓
    Verification Service
        ↓
    Verification DB

Possible information:

- certificateId
- reported field
- expected value
- observed value
- description
- timestamp
- reporter
- report status

This can later support an admin review workflow.

---

# 14. Admin

Do not create an Admin microservice simply because there is an Admin UI.

Initially, use the Auth Service with an ADMIN role.

Possible admin capabilities:

- Institution management
- User management
- Certificate monitoring
- Mismatch report review
- Verification monitoring

Only extract a separate Admin Service if administrative functionality becomes a sufficiently large business domain.

---

# 15. Database Architecture

Use database-per-service logically.

A shared hosted MySQL server is acceptable.

Example:

    MySQL Server
    ├── credencify_auth_db
    ├── credencify_certificate_db
    └── credencify_verification_db

Rules:

- Each service owns its database.
- Never directly access another service's database.
- Communicate through APIs/Feign.
- A single physical MySQL server can host multiple logical databases.

Do not create a separate Blockchain SQL database unless there is a real operational requirement.

---

# 16. Microservice Principle

Do not create a microservice for every technical operation.

Avoid unnecessary services such as:

- Hash Service
- QR Service
- Database Service
- Blockchain Database Service
- Risk Service
- Tiny OCR Service

The intended business services are:

- Auth Service
- Certificate Service
- Blockchain Service
- Verification Service
- AI/Document Processing Service

Infrastructure:

- API Gateway
- Eureka

A new service must have a meaningful business responsibility and justify its deployment/maintenance cost.

---

# 17. Security

The final system should consider:

- Institution authentication
- Authorization
- Role-based access
- Internal service security
- API validation
- Rate limiting
- Secure configuration
- Secret management
- Blockchain private-key protection
- No sensitive student data on blockchain
- Input validation
- Audit logging

Never hard-code production secrets or private keys in source code.

For development, keep security implementation proportional to the current milestone, but preserve correct boundaries.

---

# 18. Error Handling

Exception handling will be implemented progressively.

Eventually use:

- Service-specific exceptions
- Global exception handlers
- @ControllerAdvice
- Proper HTTP status codes
- Clear error response DTOs
- Feign error handling
- Blockchain/network failure handling

Do not classify infrastructure failures as certificate fraud.

Examples:

    Certificate not found → 404

    Unauthorized institution → 401/403

    Duplicate certificate → appropriate conflict response

    Invalid certificate state → appropriate business error

    Blockchain unavailable → service/dependency error

    Blockchain hash mismatch → verification failure

Keep error semantics clear.

---

# 19. API Design

Prefer versioned APIs:

    /api/v1.0/...

Keep external/public APIs separate from internal service-to-service endpoints.

Example:

    /api/v1.0/certificates
    /api/v1.0/verify/{certificateId}

Internal blockchain endpoint can remain an internal service endpoint.

Do not expose internal blockchain operations unnecessarily to public clients.

---

# 20. Existing Code Rule

The current implementation is considered a working foundation.

Before modifying anything:

- Inspect existing code.
- Understand it.
- Reuse it.
- Preserve working APIs where possible.
- Do not rename classes/packages/services unnecessarily.
- Do not replace Web3j implementation without reason.
- Do not replace Feign communication without reason.
- Do not redesign the database without reason.
- Do not break the existing frontend.

If something can be improved without migration or breaking existing behavior, improve it incrementally.

---

# 21. Development Strategy

Do not implement the entire final system at once.

Work in milestones.

Recommended order:

1. Stabilize current Certificate Service + DB + Blockchain flow.
2. Create Verification Service.
3. Implement basic Certificate-ID verification.
4. Add proper verification response DTOs.
5. Add QR generation/verification.
6. Add certificate revocation.
7. Add verification history/reporting.
8. Add mismatch reporting.
9. Add OCR/document upload.
10. Add structured field extraction.
11. Add hybrid comparison.
12. Add explainable risk scoring.
13. Harden security and reliability.
14. Add testing, monitoring, auditability, and deployment improvements.

At every milestone:

- Understand existing implementation first.
- Change only what is needed.
- Test existing functionality.
- Avoid premature complexity.

---

# 22. Final Target Architecture

    React Portal
         ↓
    API Gateway
         ↓
    Eureka / Service Discovery
         ↓
    ┌───────────────────────────────────────┐
    │                                       │
    ▼                                       ▼
    Auth Service                     Certificate Service
    │                                       │
    ▼                                       ▼
    Auth DB                          Certificate DB
                                            │
                                            │ Feign
                                            ▼
                                    Blockchain Service
                                            │
                                            ▼
                                      Web3j + Solidity
                                            │
                                            ▼
                                     Ethereum Sepolia


    Verification Service
          │
          ├──→ Certificate Service
          │
          └──→ Blockchain Service


    Future:

    Verification Service
          │
          ▼
    AI/Document Processing
          │
       ┌──┴──┐
       ▼     ▼
      OCR    AI
              │
              ▼
       Risk / Comparison

---

# 23. Product Philosophy

The final product is not simply:

"Put certificates on blockchain."

It is:

> A privacy-aware, service-oriented certificate verification platform where sensitive certificate data remains off-chain and blockchain provides immutable cryptographic proof.

The system should combine:

- Spring Boot
- Java
- React
- MySQL
- Microservices
- Eureka
- OpenFeign
- Web3j
- Solidity
- Ethereum Sepolia
- SHA-256
- OCR
- AI-assisted document analysis

without unnecessary architectural complexity.

The architecture should be technically strong enough for a serious academic/hackathon project while remaining understandable and maintainable by the development team.

---

# 24. Golden Rule

Before implementing any new feature:

1. Check whether an existing service already owns the responsibility.
2. Do not create a new microservice unless the responsibility is a genuine business boundary.
3. Do not duplicate data unnecessarily.
4. Do not bypass another service's API to access its database.
5. Keep blockchain logic inside Blockchain Service.
6. Keep certificate business logic inside Certificate Service.
7. Keep verification decisions inside Verification Service.
8. Keep authentication/authorization inside Auth Service.
9. Keep AI/document processing isolated when it becomes substantial.
10. Preserve existing working functionality.

Always prefer:

    Clear responsibility
        +
    Minimal coupling
        +
    Reusable APIs
        +
    Incremental development

over unnecessary complexity.
