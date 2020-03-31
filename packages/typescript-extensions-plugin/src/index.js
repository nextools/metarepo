/* eslint-disable max-params */
const path = require('path')

// https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin
// https://github.com/microsoft/TypeScript/wiki/Using-the-Compiler-API
const init = ({ typescript }) => {
  const fileExists = (fileName) => typescript.sys.fileExists(fileName)
  const readFile = (fileName) => typescript.sys.readFile(fileName)

  const isResolvable = (moduleName, containingFile, options) => {
    const result = typescript.resolveModuleName(moduleName, containingFile, options, {
      fileExists,
      readFile,
    })

    if (typeof result.resolvedModule === 'undefined') {
      return false
    }

    return true
  }

  const resolveModuleName = (variants, containingFile, options) => {
    for (const variant of variants) {
      if (isResolvable(variant, containingFile, options)) {
        return variant
      }
    }

    return variants[0]
  }

  return {
    create(info) {
      const origResolveModuleNames = info.languageServiceHost.resolveModuleNames

      info.languageServiceHost.resolveModuleNames = (moduleNames, containingFile, reusedNames, redirectedReference, options) => {
        const newModuleNames = moduleNames.map((moduleName) => {
          if (moduleName.startsWith('.')) {
            return resolveModuleName(
              [
                moduleName,
                `${moduleName}.web`,
                `${moduleName}${path.sep}index.web`,
              ],
              containingFile,
              options
            )
          }

          return moduleName
        })

        return origResolveModuleNames.call(info.languageServiceHost, newModuleNames, containingFile, reusedNames, redirectedReference)
      }

      return info.languageService
    },
  }
}

module.exports = init
