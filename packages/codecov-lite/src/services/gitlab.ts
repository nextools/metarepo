import { TServiceConfig } from '../types'

// https://docs.gitlab.com/ce/ci/variables/README.html
export default (env: NodeJS.ProcessEnv): TServiceConfig => {
  if (!env.GITLAB_CI) {
    return null
  }

  const remote = env.CI_BUILD_REPO || env.CI_REPOSITORY_URL || ''

  return {
    service: 'gitlab',
    build: env.CI_BUILD_ID,
    commit: env.CI_BUILD_REF,
    branch: env.CI_BUILD_REF_NAME,
    slug: remote
      .split('/')
      .slice(3, 5)
      .join('/')
      .replace('.git', ''),
  }
}
