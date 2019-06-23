import { TServiceConfig } from '../types'

// https://wiki.jenkins-ci.org/display/JENKINS/Building+a+software+project#Buildingasoftwareproject-JenkinsSeNodeJS.ProcessEnvironmentVariables
export default (env: NodeJS.ProcessEnv): TServiceConfig => {
  if (!env.JENKINS_URL) {
    return null
  }

  return {
    service: 'jenkins',
    commit: env.ghprbActualCommit || env.GIT_COMMIT,
    branch: env.ghprbSourceBranch || env.GIT_BRANCH || env.BRANCH_NAME,
    build: env.BUILD_NUMBER,
    build_url: env.BUILD_URL,
    pr: env.ghprbPullId || env.CHANGE_ID,
  }
}
