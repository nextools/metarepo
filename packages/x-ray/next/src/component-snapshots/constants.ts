import { cpus } from 'os'

export const MAX_THREAD_COUNT = cpus().length
export const WORKER_PATH = require.resolve('./worker-setup')
export const SNAPSHOTS_PER_WORKER_COUNT = 4
