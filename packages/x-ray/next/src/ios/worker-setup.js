if (process.env.BABEL_ENV !== 'production') {
  require('@babel/register')(require('@bubble-dev/babel-config').babelConfigNodeRegister)
}

require('./worker').init()
