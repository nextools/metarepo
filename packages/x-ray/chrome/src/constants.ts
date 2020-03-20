import { cpus } from 'os'

export const MAX_THREAD_COUNT = cpus().length
export const WORKER_PATH = require.resolve('./worker-setup')

export const SCREENSHOTS_CONCURRENCY = 4
export const SHORT_PATH_CONCURRENCY = 4
export const WRITE_RESULT_CONCURRENCY = 4

export const SERVER_HOST = 'localhost'
export const SERVER_PORT = 3001
export const UI_HOST = 'localhost'
export const UI_PORT = 3000
