pipeline {
    agent any

    options {
        timestamps()
        timeout(time: 30, unit: 'MINUTES')
    }

    environment {
        BACKEND_IMAGE = "tours-booking-backend"
        FRONTEND_IMAGE = "tours-booking-frontend"
        BACKEND_TEST_IMAGE = "tours-booking-backend-test"
    }

    stages {
        stage('1 · Build') {
            steps {
                sh '''
                    echo "Building backend image..."
                    docker build -t $BACKEND_IMAGE:$BUILD_NUMBER -t $BACKEND_IMAGE:latest ./backend

                    echo "Building frontend image..."
                    docker build -t $FRONTEND_IMAGE:$BUILD_NUMBER -t $FRONTEND_IMAGE:latest ./frontend
                '''
            }
        }

        stage('2 · Test') {
            steps {
                sh '''
                    echo "Running backend tests inside Docker..."
                    docker build -f backend/Dockerfile.test -t $BACKEND_TEST_IMAGE:$BUILD_NUMBER ./backend
                    docker run --rm $BACKEND_TEST_IMAGE:$BUILD_NUMBER
                '''
            }
        }

        stage('3 · Code Quality') {
            steps {
                withCredentials([string(credentialsId: 'SONAR_TOKEN', variable: 'SONAR_TOKEN')]) {
                    sh 'sonar-scanner'
                }
            }
        }

        stage('4 · Security') {
            steps {
                sh '''
                    echo "Running Trivy security scan..."

                    docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy image --severity HIGH,CRITICAL --no-progress tours-booking-backend:latest || true

                    docker run --rm \
                    -v /var/run/docker.sock:/var/run/docker.sock \
                    aquasec/trivy image --severity HIGH,CRITICAL --no-progress tours-booking-frontend:latest || true
                '''
            }
        }

        stage('5 · Deploy') {
            steps {
                sh '''
                    echo "Deploying application with Docker Compose..."
                    docker-compose down || true
                    docker-compose build --no-cache
                    docker-compose up -d
                    docker-compose ps
                '''
            }
        }

        stage('6 · Release') {
            steps {
                sh '''
                    echo "Release completed for build #$BUILD_NUMBER"
                    echo "Backend image: $BACKEND_IMAGE:$BUILD_NUMBER"
                    echo "Frontend image: $FRONTEND_IMAGE:$BUILD_NUMBER"
                '''
            }
        }

        stage('7 · Monitoring') {
            steps {
                sh '''
                    echo "Checking backend health endpoint..."
                    sleep 10
                    docker exec tours-backend sh -c "wget -qO - http://localhost:5000/health"
                '''
            }
        }
    }

    post {
        always {
            sh '''
                echo "Containers after pipeline:"
                docker compose ps || true
            '''
        }

        success {
            echo "Pipeline completed successfully."
        }

        failure {
            echo "Pipeline failed. Check the stage logs."
        }
    }
}