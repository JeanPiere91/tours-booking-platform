# Sprint 3 — DevOps CI/CD Pipeline

## Sprint Goal

Implement a Jenkins CI/CD pipeline for the Tours Booking Platform to automate build, testing, code quality analysis, security scanning, deployment, release, and monitoring verification.

---

# User Stories Included

## HU-10 · Build application automatically

As a developer  
I want Jenkins to automatically build the frontend and backend applications  
so that every code change can be prepared for deployment consistently.

### Acceptance Criteria

- Jenkins can pull the latest code from GitHub.
- The pipeline builds the frontend and backend successfully.
- Docker images or application artefacts are generated.
- Build logs are clear and easy to understand.

---

## HU-11 · Run automated tests in the pipeline

As a developer  
I want Jenkins to run automated backend tests  
so that broken functionality is detected before deployment.

### Acceptance Criteria

- Jenkins runs the backend test suite using Jest.
- The pipeline fails if tests fail.
- Test output is visible in Jenkins logs.
- The test stage is clearly separated from the build stage.

---

## HU-12 · Run code quality analysis

As a developer  
I want Jenkins to run code quality checks  
so that maintainability issues can be detected early.

### Acceptance Criteria

- The pipeline includes a Code Quality stage.
- SonarCloud or SonarQube is used for code quality analysis.
- The stage reports issues such as code smells, duplication, or maintainability problems.
- The Jenkinsfile includes the required commands or placeholders for SonarCloud integration.

---

## HU-13 · Run security scanning

As a developer  
I want Jenkins to scan the application or Docker images for vulnerabilities  
so that security risks are identified before deployment.

### Acceptance Criteria

- The pipeline includes a Security stage.
- Trivy or an equivalent security tool is used.
- Vulnerability results are visible in the Jenkins logs.
- The stage can detect dependency or container image vulnerabilities.

---

## HU-14 · Deploy application automatically

As a developer  
I want Jenkins to deploy the application using Docker Compose  
so that the latest successful version can run in a test or server environment.

### Acceptance Criteria

- The pipeline includes a Deploy stage.
- Docker Compose is used to start or update the application containers.
- The frontend and backend containers run successfully after deployment.
- The deployment process can be repeated reliably.

---

## HU-15 · Create a release step

As a developer  
I want Jenkins to include a release stage  
so that successful builds can be identified as stable versions.

### Acceptance Criteria

- The pipeline includes a Release stage.
- The release stage uses a build number, version label, or Git tag concept.
- Release information is visible in the Jenkins logs.
- The release process is repeatable.

---

## HU-16 · Verify monitoring and health check

As a developer  
I want Jenkins to verify that the deployed application is healthy  
so that deployment issues can be detected immediately.

### Acceptance Criteria

- The pipeline includes a Monitoring stage.
- Jenkins checks the backend health endpoint.
- The pipeline verifies that `GET /health` responds successfully.
- Monitoring output is visible in Jenkins logs.

---

# Technical Scope

## Jenkins Pipeline Stages

1. Build
2. Test
3. Code Quality
4. Security
5. Deploy
6. Release
7. Monitoring

---

# DevOps Tools

- Jenkins
- Docker
- Docker Compose
- Jest
- Supertest
- SonarCloud or SonarQube
- Trivy
- GitHub

---

# Pipeline Requirements

- Use declarative Jenkins pipeline syntax.
- Build frontend and backend Docker containers.
- Run backend automated tests.
- Include SonarCloud/SonarQube code quality analysis stage.
- Include Trivy security scanning stage.
- Deploy with Docker Compose.
- Verify deployment using the `/health` endpoint.
- Keep console output clear and professional.
- Prepare the pipeline for execution on a Linux Jenkins server.

---

# Environment and Secrets

The pipeline may require environment variables or Jenkins credentials for:

- `RESEND_API_KEY`
- `AGENCY_EMAIL`
- `FROM_EMAIL`
- `SONAR_TOKEN`
- Docker or server access if needed later

Sensitive values must be stored in Jenkins Credentials or environment variables and must not be committed to GitHub.

---

# Out of Scope for this Sprint

- Online payments
- Admin dashboard
- Customer authentication
- Kubernetes
- Complex cloud infrastructure
- Production-grade monitoring dashboards
- Advanced rollback automation
