#!/bin/sh
':' //# comment; exec /usr/bin/env node --experimental-worker "$0" "$@"
// http://sambal.org/2014/02/passing-options-node-shebang-line/

/* eslint-disable no-global-assign */
/* eslint-disable no-process-exit */
/* eslint-disable import/no-dynamic-require */
const { resolve } = require('path')
const { start: options } = require(resolve('./package.json'))

const isEsmLoader = (required) => required[Symbol.for('esm:package')] || required[Symbol.for('esm\u200D:package')]

if (Array.isArray(options.require)) {
  options.require.forEach((pkg) => {
    if (typeof pkg === 'string') {
      const required = require(pkg)

      if (isEsmLoader(required)) {
        require = required(module)
      }
    } else if (Array.isArray(pkg)) {
      const required = require(pkg[0])

      if (isEsmLoader(required)) {
        require = required(module, pkg[1])
      } else {
        required(pkg[1])
      }
    }
  })
}

const { default: cliLib } = require('./lib')

cliLib(process.argv, options).catch((error) => {
  if (error !== null) {
    console.log(error)
  }

  process.exit(1)
})
