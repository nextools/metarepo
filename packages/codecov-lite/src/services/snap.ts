import { TServiceConfig } from '../types'

// https://docs.snap-ci.com/environment-variables/
export default (env: NodeJS.ProcessEnv): TServiceConfig => {
  if (!env.SNAP_CI) {
    return null
  }

  return {
    service: 'snap',
    build: env.SNAP_PIPELINE_COUNTER,
    commit: env.SNAP_COMMIT || env.SNAP_UPSTREAM_COMMIT,
    branch: env.SNAP_BRANCH || env.SNAP_UPSTREAM_BRANCH,
    pr: env.SNAP_PULL_REQUEST_NUMBER,
  }
}
