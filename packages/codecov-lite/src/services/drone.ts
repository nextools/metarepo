import { TServiceConfig } from '../types'

// http://docs.drone.io/env.html
export default (env: NodeJS.ProcessEnv): TServiceConfig => {
  if (!env.DRONE) {
    return null
  }

  return {
    service: 'drone.io',
    build: env.DRONE_BUILD_NUMBER,
    commit: env.DRONE_COMMIT,
    build_url: env.DRONE_BUILD_URL,
    branch: env.DRONE_BRANCH,
  }
}
