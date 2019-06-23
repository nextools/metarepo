import { TServiceConfig } from '../types'

// http://devcenter.wercker.com/docs/environment-variables/available-env-vars.html
export default (env: NodeJS.ProcessEnv): TServiceConfig => {
  if (!env.WERCKER_MAIN_PIPELINE_STARTED) {
    return null
  }

  return {
    service: 'wercker',
    build: env.WERCKER_MAIN_PIPELINE_STARTED,
    commit: env.WERCKER_GIT_COMMIT,
    build_url: env.WERCKER_BUILD_URL,
    branch: env.WERCKER_GIT_BRANCH,
    slug: `${env.WERCKER_GIT_OWNER}/${env.WERCKER_GIT_REPOSITORY}`,
  }
}
