import { TServiceConfig } from '../types'

// https://buildkite.com/docs/guides/environment-variables
export default (env: NodeJS.ProcessEnv): TServiceConfig => {
  if (!env.BUILDKITE) {
    return null
  }

  return {
    service: 'buildkite',
    commit: env.BUILDKITE_COMMIT,
    branch: env.BUILDKITE_BRANCH,
    build: env.BUILDKITE_BUILD_NUMBER,
    build_url: env.BUILDKITE_BUILD_URL,
    slug: env.BUILDKITE_PROJECT_SLUG,
  }
}
