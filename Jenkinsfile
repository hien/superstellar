import static Constants.*

class Constants {
    static final AWS_CREDENTIALS = 'adae9164-3272-49b1-ab0a-6475983d0ed2'
    static final DOCKER_REGISTRY_URL = 'https://738931564455.dkr.ecr.eu-central-1.amazonaws.com'
    static final DOCKER_REGISTRY_CREDENTIALS = 'u2i-jenkins-ecr-docker-login'
}

discardOldBuilds()

@NonCPS
def jsonParse(def json) {
    new groovy.json.JsonSlurperClassic().parseText(json)
}

stage('Checkout') {
    node {
        withCleanup {
            checkout scm
            stash 'source'
        }
    }
}   

stage('Build & Test backend') {
    node('docker') {
        withCleanup {
            unstash 'source'

            docker.image('golang:1.7.1').inside("-e HOME=/go -w /go/src/superstellar -v ${pwd()}:/go/src/superstellar") {
                sh 'git config --global user.name "Dummy" && git config --global user.email "dummy@example.com"'
                sh """
                    go get superstellar github.com/onsi/ginkgo github.com/onsi/gomega
                    go build superstellar
                    go test superstellar
                """
                sh 'cp /go/bin/superstellar .'
            }

            stage('Package & Publish backend') {
                masterBranchOnly {
                    def image = docker.build('u2i/superstellar')

                    privateRegistry {
                        image.push(env.BUILD_NUMBER)
                        image.push('latest')
                    }
                }
            }
        }
    }
}

stage('Build frontend') {
    node('docker') {
        withCleanup {
            unstash 'source'

            dir('webroot') {
                docker.image('node:6.7').inside("-e HOME=${pwd()}") {
                    sh 'npm --quiet install'
                    sh 'PATH=$PATH:node_modules/.bin npm --quiet run build'
                }

                stage('Package & Publish frontend') {
                    masterBranchOnly {
                        def image = docker.build('u2i/superstellar_nginx')

                        privateRegistry {
                            image.push(env.BUILD_NUMBER)
                            image.push('latest')
                        }
                    }
                }
            }
        }
    }
}

masterBranchOnly {
    stage(name: 'Deploy', concurrency: 1) {
        node('docker') {
            withCleanup {
                String fileName = java.util.UUID.randomUUID().toString()

                aws("--region=eu-central-1 ecs list-tasks --cluster=default > ${fileName}")

                String resultString = readFile(fileName).trim()
                def result = jsonParse(resultString)

                for (String task in result['taskArns']) {
                    String taskId = task.split(":task/")[1]
                    aws("--region=eu-central-1 ecs stop-task --task ${taskId} > /dev/null")
                }
            }
        }
    }
}

def masterBranchOnly(Closure cl) {
    if (env.BRANCH_NAME == 'master') {
        cl()
    }
}

def aws(String cmd) {
    withAwsCredentials(AWS_CREDENTIALS) {
        sh """
            docker run --rm -e AWS_ACCESS_KEY_ID=${env.AWS_ACCESS_KEY_ID} -e AWS_SECRET_ACCESS_KEY=${env.AWS_SECRET_ACCESS_KEY} -v ${pwd()}:/tmp -w /tmp \
                mikesir87/aws-cli:1.11.3 aws $cmd
       """
   }
}

def privateRegistry(Closure cl) {
    docker.withRegistry(DOCKER_REGISTRY_URL, DOCKER_REGISTRY_CREDENTIALS) {
        cl()
    }
}