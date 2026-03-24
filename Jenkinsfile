pipeline {
    agent any

    environment {
        DOCKER_USER = "aryutechnologies2025"
        IMAGE = "hrms-admin"
    }

    stages {

        stage('Build Image') {
            steps {
                sh '''
                docker build -t $DOCKER_USER/$IMAGE:latest .
                '''
            }
        }

        stage('Docker Login & Push') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds', usernameVariable: 'USER', passwordVariable: 'PASS')]) {
                    sh '''
                    echo $PASS | docker login -u $USER --password-stdin
                    docker push $USER/$IMAGE:latest
                    '''
                }
            }
        }

        stage('Deploy Admin') {
            steps {
                sh '''
                cd /var/www/Hrms
                docker-compose pull admin
                docker-compose up -d admin
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                docker ps | grep hrms-admin
                '''
            }
        }
    }
}
