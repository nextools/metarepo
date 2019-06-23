import { TServiceConfig } from '../types'

// https://circleci.com/docs/environment-variables/
export default (env: NodeJS.ProcessEnv): TServiceConfig => {
  if (!env.CIRCLECI) {
    return null
  }

  const url = env.CIRCLE_REPOSITORY_URL || ''

  return {
    service: 'circleci',
    build: `${env.CIRCLE_BUILD_NUM}.${env.CIRCLE_NODE_INDEX}`,
    job: `${env.CIRCLE_BUILD_NUM}.${env.CIRCLE_NODE_INDEX}`,
    commit: env.CIRCLE_SHA1,
    branch: env.CIRCLE_BRANCH,
    pr: env.CIRCLE_PR_NUMBER,
    slug: url.replace(/^.*:/, '').replace(/\.git$/, ''),
  }
}
