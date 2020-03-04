#!/bin/sh
':' //# comment; exec /usr/bin/env node --experimental-worker "$0" "$@"
// http://sambal.org/2014/02/passing-options-node-shebang-line/

require('dotenv/config')

require('@babel/register')(require('@bubble-dev/babel-config').babelConfigNodeRegister)

require('./cli')
