import { TServiceConfig } from '../types'

// https://docs.travis-ci.com/user/environment-variables/#Default-Environment-Variables
export default (env: NodeJS.ProcessEnv): TServiceConfig => {
  if (!env.TRAVIS) {
    return null
  }

  return {
    service: 'travis',
    commit: env.TRAVIS_COMMIT,
    build: env.TRAVIS_JOB_NUMBER,
    branch: env.TRAVIS_BRANCH,
    job: env.TRAVIS_JOB_ID,
    pr: env.TRAVIS_PULL_REQUEST,
    slug: env.TRAVIS_REPO_SLUG,
  }
}
