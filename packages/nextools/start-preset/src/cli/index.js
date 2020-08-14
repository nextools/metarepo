#!/usr/bin/env node

require('dotenv/config')

require('@babel/register')(require('@nextools/babel-config').babelConfigNodeRegister)

require('./cli')
