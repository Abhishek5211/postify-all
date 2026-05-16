pipeline {
    agent any
    environment {
        BACKEND_IMAGE = "postify-backend:1.0.0"
        FRONTEND_IMAGE = "postify-frontend:1.0.0"
    }
    stages {
        stage('Checkout') {
            steps {
                sh 'git config --global http.postBuffer 524288000'
                sh 'git config --global http.sslVerify false' // Temporary troubleshooting che
                git branch: 'main', url: 'https://gitlab.com/Abhishek5211/postify-all.git'
            }
        }
        stage('Create ConfigMap') {
            steps {
                sh 'kubectl create configmap db-init-conf --from-file=${WORKSPACE}/init.sql --dry-run=client --validate=false -o yaml | kubectl apply -f - --validate=false'
            }
        }
      stage('Build & Tag') {
            steps {
                // Navigate into the backend folder context before building
                dir("Postify-dbms-backend") {
                    sh "docker build -t ${BACKEND_IMAGE} ."
                }
                // Navigate into the frontend folder context before building
                dir("Postify-dbms-frontend") {
                    sh "docker build -t ${FRONTEND_IMAGE} ."
                }
            }
        }
        stage('Deploy to K8s') {
            steps {
               dir("kube") {
            sh "kubectl apply -f mariadb-pvc.yaml --validate=false"
            sh "kubectl apply -f mariadb-deployment.yaml --validate=false"
            sh "kubectl apply -f backend-deployment.yaml --validate=false"
            sh "kubectl apply -f frontend-deployment.yaml --validate=false"
        }
        }
    }
}