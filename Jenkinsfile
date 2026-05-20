// Tours Booking Platform — CI/CD pipeline (Sprint 3)
// Runs on a Linux Jenkins agent with Docker + Docker Compose v2 installed.
//
// Optional Jenkins credentials this pipeline knows how to use:
//   sonar-token            (Secret Text)  enables stage 3 (SonarCloud)
//   resend-api-key         (Secret Text)  enables booking emails in deploy
//   resend-from-email      (Secret Text)  e.g. "Inka Planet Adventure <bookings@ipa.com.pe>"
//   resend-agency-email    (Secret Text)  e.g. "info@ipa.com.pe"
// Each is optional — missing credentials are reported and the stage is skipped.

pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '15', artifactNumToKeepStr: '10'))
        disableConcurrentBuilds()
    }

    environment {
        APP_NAME             = 'tours-booking-platform'
        IMAGE_TAG            = "${env.BUILD_NUMBER}"
        BACKEND_IMAGE        = 'tours-booking-backend'
        FRONTEND_IMAGE       = 'tours-booking-frontend'
        COMPOSE_PROJECT_NAME = 'tours_jenkins'
        BACKEND_HEALTH_URL   = 'http://localhost:5000/health'
        FRONTEND_URL         = 'http://localhost:5173'

        // SonarCloud (the credential 'sonar-token' enables stage 3)
        SONAR_HOST_URL       = 'https://sonarcloud.io'
        SONAR_PROJECT_KEY    = 'tours-booking-platform'
        SONAR_ORGANIZATION   = 'inka-planet-adventure'
    }

    stages {

        stage('Setup') {
            steps {
                script {
                    echo '═══════════════════════════════════════════════════════════════'
                    echo "  ${APP_NAME} — pipeline #${env.BUILD_NUMBER}"
                    echo '═══════════════════════════════════════════════════════════════'
                }
                sh '''
                    echo "Workspace: $(pwd)"
                    echo "Branch:    ${BRANCH_NAME:-(no branch info)}"
                    git log -1 --pretty=format:"Commit:    %h%nAuthor:    %an%nMessage:   %s" 2>/dev/null || true
                    echo ""
                    echo "Docker:        $(docker --version)"
                    echo "Compose:       $(docker compose version --short 2>/dev/null || echo 'n/a')"
                '''
            }
        }

        stage('1 · Build') {
            steps {
                script { echo '─── Building backend image ──────────────────────────────' }
                sh """
                    docker build \\
                        --tag ${BACKEND_IMAGE}:${IMAGE_TAG} \\
                        --tag ${BACKEND_IMAGE}:latest \\
                        ./backend
                """

                script { echo '─── Building frontend image ─────────────────────────────' }
                sh """
                    docker build \\
                        --tag ${FRONTEND_IMAGE}:${IMAGE_TAG} \\
                        --tag ${FRONTEND_IMAGE}:latest \\
                        ./frontend
                """

                script { echo '─── Build summary ───────────────────────────────────────' }
                sh '''
                    docker images \\
                        --filter "reference=tours-booking-*" \\
                        --format "table {{.Repository}}\\t{{.Tag}}\\t{{.Size}}\\t{{.CreatedSince}}"
                '''
            }
        }

        stage('2 · Test') {
            steps {
                script { echo '─── Running backend Jest suite ──────────────────────────' }
                sh '''
                    docker run --rm \\
                        --user "$(id -u):$(id -g)" \\
                        -e HOME=/tmp \\
                        -e NODE_ENV=test \\
                        -v "$(pwd)/backend:/app" \\
                        -w /app \\
                        node:20-alpine \\
                        sh -c "npm ci --no-audit --no-fund && npm run test:ci"
                '''
            }
            post {
                always {
                    junit allowEmptyResults: true, testResults: 'backend/reports/junit.xml'
                    archiveArtifacts artifacts: 'backend/coverage/lcov-report/**', allowEmptyArchive: true
                    archiveArtifacts artifacts: 'backend/coverage/cobertura-coverage.xml', allowEmptyArchive: true
                }
            }
        }

        stage('3 · Code Quality') {
            steps {
                script {
                    echo '─── SonarCloud analysis ─────────────────────────────────'
                    try {
                        withCredentials([string(credentialsId: 'sonar-token', variable: 'SONAR_TOKEN')]) {
                            sh """
                                docker run --rm \\
                                    -e SONAR_TOKEN=\${SONAR_TOKEN} \\
                                    -e SONAR_HOST_URL=${SONAR_HOST_URL} \\
                                    -v "\$(pwd):/usr/src" \\
                                    sonarsource/sonar-scanner-cli:latest \\
                                        -Dsonar.projectKey=${SONAR_PROJECT_KEY} \\
                                        -Dsonar.organization=${SONAR_ORGANIZATION} \\
                                        -Dsonar.sources=backend/src,frontend/src \\
                                        -Dsonar.tests=backend/__tests__ \\
                                        -Dsonar.javascript.lcov.reportPaths=backend/coverage/lcov.info
                            """
                        }
                    } catch (err) {
                        echo 'PLACEHOLDER — SonarCloud not configured. Stage skipped.'
                        echo 'To enable: add a "sonar-token" Secret Text credential in Jenkins.'
                        echo "Details: ${err.message}"
                    }
                }
            }
        }

        stage('4 · Security') {
            steps {
                script {
                    echo '─── Trivy image vulnerability scan ──────────────────────'
                    def trivyReady = sh(
                        script: 'docker pull aquasec/trivy:latest > /dev/null 2>&1',
                        returnStatus: true
                    ) == 0

                    if (trivyReady) {
                        ['backend', 'frontend'].each { svc ->
                            def image = (svc == 'backend')
                                ? "${BACKEND_IMAGE}:${IMAGE_TAG}"
                                : "${FRONTEND_IMAGE}:${IMAGE_TAG}"
                            echo "Scanning ${image}…"
                            sh """
                                docker run --rm \\
                                    -v /var/run/docker.sock:/var/run/docker.sock \\
                                    aquasec/trivy:latest image \\
                                        --no-progress \\
                                        --severity HIGH,CRITICAL \\
                                        --exit-code 0 \\
                                        ${image}
                            """
                        }
                    } else {
                        echo 'PLACEHOLDER — Trivy not available. Stage skipped.'
                        echo 'To enable: ensure the Jenkins host can pull aquasec/trivy:latest.'
                    }
                }
            }
        }

        stage('5 · Deploy') {
            steps {
                script {
                    echo '─── Deploying with Docker Compose ───────────────────────'
                    try {
                        withCredentials([
                            string(credentialsId: 'resend-api-key',     variable: 'RESEND_API_KEY'),
                            string(credentialsId: 'resend-from-email',  variable: 'FROM_EMAIL'),
                            string(credentialsId: 'resend-agency-email', variable: 'AGENCY_EMAIL')
                        ]) {
                            sh '''
                                docker compose down --remove-orphans || true
                                docker compose up -d
                            '''
                        }
                        echo 'Resend credentials injected — booking emails will be sent.'
                    } catch (err) {
                        echo 'Resend credentials not configured — deploying with email disabled.'
                        sh '''
                            docker compose down --remove-orphans || true
                            docker compose up -d
                        '''
                    }
                }
                sh 'docker compose ps'
            }
        }

        stage('6 · Release') {
            steps {
                script { echo '─── Tagging release ─────────────────────────────────────' }
                sh """
                    docker tag ${BACKEND_IMAGE}:${IMAGE_TAG}  ${BACKEND_IMAGE}:release-${IMAGE_TAG}
                    docker tag ${FRONTEND_IMAGE}:${IMAGE_TAG} ${FRONTEND_IMAGE}:release-${IMAGE_TAG}
                """
                script {
                    echo "Release: ${APP_NAME} v0.3.${IMAGE_TAG}"
                    echo "  Backend  → ${BACKEND_IMAGE}:release-${IMAGE_TAG}"
                    echo "  Frontend → ${FRONTEND_IMAGE}:release-${IMAGE_TAG}"
                    echo ''
                    echo 'PLACEHOLDER — `docker push` to a registry and `git tag` would go here.'
                }
            }
        }

        stage('7 · Monitoring') {
            steps {
                script { echo '─── Verifying deployment health ─────────────────────────' }
                sh '''
                    set +e
                    attempts=0
                    max_attempts=12

                    until curl -fsS "$BACKEND_HEALTH_URL" -o /tmp/health.json; do
                        attempts=$((attempts + 1))
                        if [ $attempts -ge $max_attempts ]; then
                            echo ""
                            echo "✘ Backend did not become healthy within $((max_attempts * 5))s."
                            echo "Container status:"
                            docker compose ps
                            echo ""
                            echo "Backend logs (last 50 lines):"
                            docker compose logs --tail 50 backend || true
                            exit 1
                        fi
                        printf "Waiting for backend (%d/%d)…\\n" "$attempts" "$max_attempts"
                        sleep 5
                    done

                    echo ""
                    echo "✔ /health responded:"
                    cat /tmp/health.json
                    echo ""

                    if curl -fsS -o /dev/null "$FRONTEND_URL"; then
                        echo "✔ Frontend reachable at $FRONTEND_URL"
                    else
                        echo "⚠ Frontend not yet reachable at $FRONTEND_URL (not fatal)."
                    fi
                '''
            }
        }
    }

    post {
        success {
            script {
                echo '═══════════════════════════════════════════════════════════════'
                echo "  ✔ Pipeline #${env.BUILD_NUMBER} succeeded for ${env.APP_NAME}"
                echo "  Frontend:  ${FRONTEND_URL}"
                echo "  Backend:   http://localhost:5000"
                echo "  Health:    ${BACKEND_HEALTH_URL}"
                echo '═══════════════════════════════════════════════════════════════'
            }
        }
        failure {
            script {
                echo '═══════════════════════════════════════════════════════════════'
                echo "  ✘ Pipeline #${env.BUILD_NUMBER} failed"
                echo '═══════════════════════════════════════════════════════════════'
            }
        }
        always {
            sh '''
                echo ""
                echo "Containers at end of run:"
                docker compose ps || true
            '''
        }
    }
}
