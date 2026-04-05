pipeline {
    agent any

    environment {
        IMAGE_NAME = 'acnecare-web-image'
        CONTAINER_NAME = 'acnecare-web-container'
        // Bỏ 127.0.0.1 để có thể truy cập qua IP Public của Server
        HOST_PORT = '5173' 
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
                echo "Đã checkout code mới nhất."
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    echo "Đang build Docker image: ${IMAGE_NAME}..."
                    sh "docker build --no-cache -t ${IMAGE_NAME}:latest ."
                }
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    sh "docker rm -f ${CONTAINER_NAME} || true"
                    
                    sh """
                    docker run -d \
                    -p ${HOST_PORT}:80 \
                    --name ${CONTAINER_NAME} \
                    --restart unless-stopped \
                    ${IMAGE_NAME}:latest
                    """
                }
            }
        }
    }

    post {
        success {
            // Câu thông báo giờ sẽ hiển thị đúng định dạng IP:Port
            echo "🎉 Deploy Frontend thành công! Bạn có thể truy cập http://203.145.47.214:${HOST_PORT}"
        }
        failure {
            echo "❌ Deploy thất bại. Vui lòng kiểm tra lại log của các step trên Jenkins."
        }
    }
}