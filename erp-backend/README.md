# Medical College ERP Backend

This repository contains the completely built-out, production-grade Node.js / Express backend for the Medical College ERP System. It operates on a modular, microservices-inspired monolithic architecture, highly optimized to interact with Firebase (Firestore, Auth, and Storage) at scale.

## Developed Architecture & Structure

Below is the generated system map showing the extensive modules built so far:

```text
erp-backend/
├── .env                       # Local Environment Variables
├── package.json               # Dependencies (express, firebase-admin, zod, etc.)
├── src/
│   ├── app.js                 # Global Express Initialization & Routing
│   ├── functions/             # Scaffolded Firebase Cloud Functions triggers
│   │   └── triggers.js        # Atomic Firestore background handlers
│   │
│   ├── shared/                # Global utilities and protections
│   │   ├── firebase/
│   │   │   └── firebase.js    # Firebase Admin SDK Configuration
│   │   └── middlewares/
│   │       ├── audit.middleware.js      # Non-blocking robust Action & Mutation Logger
│   │       ├── auth.middleware.js       # Extracts and validates Firebase JWT
│   │       ├── rateLimit.middleware.js  # DDoS API flooding protection (100/15m)
│   │       ├── role.middleware.js       # RBAC Context validator (admin/staff/student)
│   │       └── validate.middleware.js   # Zod schema unifier returning precise 400s
│   │
│   └── modules/               # The 16 Core ERP Modules
│       ├── academic/          # Lecture creation, highly scalable Attendance Arrays
│       ├── admission/         # Application intake, Admin-approval -> Student onboarding
│       ├── alumni/            # Transcript routing and historical transition tracking
│       ├── certificate/       # Central transcript generation and document logging
│       ├── clinical/          # Anonymized case exposure verification tracking
│       ├── dashboard/         # Scalable aggregated metric retrieval limits reads
│       ├── examination/       # Fee-gated exam registrations and Batch Result publishing
│       ├── feedback/          # Flexible rating collections supporting anonymity flags
│       ├── fees/              # Structure definitions, Demand batch writes, and simulation
│       ├── hostel/            # Transactional allocations, Zod-verified IN/OUT movement tracking & subcollection Visitor logging
│       ├── identity/          # Firebase -> Database User Link & Profile syncing
│       ├── staff/             # Leave Requests tracking & automated Payroll deduction runs
│       └── store/             # Strict ACID IN/OUT chemical limits via FireStore increment
```

## Security & Privacy Enforcement Designed

1. **Zero-Trust Access**: Every HTTP route parses `verifyToken` natively, halting random traffic.
2. **Explicit RBAC Boundaries**: Endpoints are natively protected (e.g. `requireRole(['admin'])`).
3. **Medical Privacy Standard**: Avoided direct `patientId` payloads, rewriting clinical tracking purely around generic `caseId` parameters to eliminate massive PII handling risks.
4. **Permanent Audit Tracing**: Integrated `auditLogs` hook intercepting actions like generating Payroll, grading exams, verifying logs, or allocating a bed.

## Running Locally

To boot up the complete system locally:
```bash
# 1. Provide an authentication service account
#    Paste your service JSON string inside `.env` referencing `FIREBASE_SERVICE_ACCOUNT_KEY`

# 2. Boot development 
npm run dev
```

*Note: The primary entry URL rests at `http://localhost:8080/`. It redirects to `/health` by default to prove operational status.*
