#!/bin/sh
//bin/sh -c :; exec /usr/bin/env node --experimental-worker "$0" "$@"
// https://unix.stackexchange.com/questions/65235/universal-node-js-shebang#comment755057_65295

require('dotenv/config')

require('@babel/register')(require('@bubble-dev/babel-config').babelConfigNodeRegister)

require('./cli')
