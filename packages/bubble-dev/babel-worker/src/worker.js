const { extname } = require('path')
const { workerData } = require('worker_threads')

const filePath = workerData.__babelWorkerOriginalFile__

if (extname(filePath) === '.ts') {
  require('@babel/register')(require('@bubble-dev/babel-config').babelConfigNodeRegister)
}

require(filePath)
