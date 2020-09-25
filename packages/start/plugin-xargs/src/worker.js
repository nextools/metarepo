const { workerData } = require('worker_threads')

process.argv[2] = workerData.taskName
process.argv[3] = workerData.arg

require(workerData.cliPath)
