const { workerData } = require('worker_threads')

if (process.env.BABEL_ENV !== 'production') {
  require('@babel/register')(require('@nextools/babel-config').babelConfigNodeRegister)
}

require('./worker').check(workerData)
