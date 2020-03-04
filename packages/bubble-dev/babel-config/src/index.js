const { babelConfigNodeBuild, babelConfigNodeRegister } = require('./node')
const { babelConfigWebApp, babelConfigWebLib } = require('./web')
const { babelConfigReactNative } = require('./native')

exports.babelConfigNodeBuild = babelConfigNodeBuild
exports.babelConfigNodeRegister = babelConfigNodeRegister
exports.babelConfigWebApp = babelConfigWebApp
exports.babelConfigWebLib = babelConfigWebLib
exports.babelConfigReactNative = babelConfigReactNative
