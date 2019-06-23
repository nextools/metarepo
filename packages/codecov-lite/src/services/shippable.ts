import { TServiceConfig } from '../types'

// http://docs.shippable.com/ci/advancedOptions/environmentVariables/
export default (env: NodeJS.ProcessEnv): TServiceConfig => {
  if (!env.SHIPPABLE) {
    return null
  }

  return {
    service: 'shippable',
    build: env.BUILD_NUMBER,
    build_url: env.BUILD_URL,
    pr: env.PULL_REQUEST,
    commit: env.COMMIT,
    branch: env.BRANCH,
    slug: env.REPO_NAME,
  }
}
