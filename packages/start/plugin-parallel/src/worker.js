const { workerData } = require('worker_threads')

process.argv[2] = workerData.taskName

process.argv.splice(3, workerData.args.length, ...workerData.args)

// eslint-disable-next-line import/no-dynamic-require
require(workerData.cliPath)
