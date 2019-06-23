import { TServiceConfig } from '../types'

// https://semaphoreci.com/docs/available-environment-variables.html
export default (env: NodeJS.ProcessEnv): TServiceConfig => {
  if (!env.SEMAPHORE) {
    return null
  }

  return {
    service: 'semaphore',
    build: `${env.SEMAPHORE_BUILD_NUMBER}.${env.SEMAPHORE_CURRENT_THREAD}`,
    commit: env.REVISION,
    branch: env.BRANCH_NAME,
    slug: env.SEMAPHORE_REPO_SLUG,
  }
}
