if (process.env.BABEL_ENV !== 'production') {
  require('@babel/register')(require('@nextools/babel-config').babelConfigNodeRegister)
}

module.exports = require('./worker')
