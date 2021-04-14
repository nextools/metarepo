const { babelConfigReactNativeBuild } = require('./native')
const { babelConfigNodeBuild, babelConfigNodeRegister } = require('./node')
const { babelConfigWebBuild } = require('./web')

exports.babelConfigNodeBuild = babelConfigNodeBuild
exports.babelConfigNodeRegister = babelConfigNodeRegister
exports.babelConfigWebBuild = babelConfigWebBuild
exports.babelConfigReactNativeBuild = babelConfigReactNativeBuild
