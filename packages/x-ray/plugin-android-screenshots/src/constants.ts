import { cpus } from 'os'

export const MAX_THREAD_COUNT = cpus().length
export const SERVER_HOST = 'localhost'
export const SERVER_PORT = 3002
export const WORKER_PATH = require.resolve('./worker-setup')
