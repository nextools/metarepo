const { babelConfigNodeBuild, babelConfigNodeRegister } = require('./node')
const { babelConfigWebBuild } = require('./web')
const { babelConfigReactNativeBuild } = require('./native')

exports.babelConfigNodeBuild = babelConfigNodeBuild
exports.babelConfigNodeRegister = babelConfigNodeRegister
exports.babelConfigWebBuild = babelConfigWebBuild
exports.babelConfigReactNativeBuild = babelConfigReactNativeBuild
