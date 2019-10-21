def currentJobDetail
pipeline {
    options { buildDiscarder(logRotator(numToKeepStr: '10')) }
    agent {
        docker {
          label 'on-prem-slave'
          registryUrl 'https://registry.sbx.zone/'
          registryCredentialsId 'registryCredentials'
          image 'registry.sbx.zone/enabler/nodeimage:latest'
        }
    }
    parameters {
        string(name: 'env', defaultValue: 'PUT12', description: 'Environment to run')
        string(name: 'pack', defaultValue: 'bronze', description: 'Pack to Execute')
        string(name: 'ff', defaultValue: '\"**\"', description: 'Feature to Execute')
        string(name: 'tags', defaultValue: "\"not @Pending\"", description: 'Tags to run')
        string(name: 'seleniumGridHost', defaultValue: 'appduv29c8.ibmsl.cloud.test.group', description: 'Selenium Grid Host')
        string(name: 'seleniumGridPort', defaultValue: '4444', description: 'Selenium Grid Port')
        string(name: 'maxInstances', defaultValue: '4', description: 'Max Instance')
        string(name: 'branch', defaultValue: 'master', description: 'Branch to build')
        string(name: 'failBuildOnFirstFailure', defaultValue: 'false', description: 'Fail Build if First Test Case Fails')
    }
    stages{
        stage('Runner Configuration') {
             steps{
                 script{
                    currentJobDetail = "${currentBuild.projectName}";
                 }
             }
        }
        stage ('Clear Workspace') {
            steps{
                step([$class: 'WsCleanup', notFailBuild: true])
            }
        }
        stage ('Pull Master Code') {
            steps {
                script{
                   git(url: 'ssh://git@gitlab.servicing.sbx.zone:29418/QE-Enablers/OSEAN.git',
                                credentialsId: 'gitssh',
                                branch: params.branch)
                }
            }
        }
        stage('Check Selenium Grid and set proxy'){
            steps {
                checkGridStatus(params.seleniumGridHost, 4444);
            }
        }
        stage('Check Node Version'){
            steps {
                script{
                    sh "node -v"
                }
            }
        }
        stage("Execute Tests") {
            steps {
                script{
                    sh """/node_modules/gulp/bin/gulp.js cucumber --env ${params.env} --pack ${params.pack} --ff ${params.ff} --tags ${params.tags} --proxyAddress 'cntlm:8888' --hostname ${params.seleniumGridHost} --port ${params.seleniumGridPort} --runner Jenkins --jobDetails ${currentJobDetail} --maxInstances ${params.maxInstances} --failBuildOnFirstFailure ${params.failBuildOnFirstFailure}"""
                }
            }
        }
    }
    post {
            success {
                script{
                     publishHTML target: [
                            allowMissing: false,
                            alwaysLinkToLastBuild: false,
                            keepAll: true,
                            reportDir: './tests/wdio/report/html/',
                            reportFiles: 'index.html',
                            reportName: 'Test Output'
                     ]
                }
            }
            failure {
                script {
                     publishHTML target: [
                            allowMissing: false,
                            alwaysLinkToLastBuild: false,
                            keepAll: true,
                            reportDir: './tests/wdio/report/html/',
                            reportFiles: 'index.html',
                            reportName: 'Test Output'
                     ]
                }
            }
        }

}
