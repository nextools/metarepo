const { workerData } = require('worker_threads')

process.argv[2] = workerData.taskName

process.argv.splice(3, workerData.args.length, ...workerData.args)

// https://github.com/nodejs/node/issues/25448
// https://github.com/nodejs/node/pull/25526
process.umask = () => workerData.umask

// eslint-disable-next-line import/no-dynamic-require
require(workerData.cliPath)
