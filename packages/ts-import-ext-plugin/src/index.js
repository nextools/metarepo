/* eslint-disable max-params */
const path = require('path')

const EXT_REGEXPS = [/\.ts$/, /\.tsx$/, /\.js$/, /\.jsx$/]

// https://github.com/microsoft/TypeScript/wiki/Writing-a-Language-Service-Plugin
const init = ({ typescript }) => {
  const fileExists = (fileName) => typescript.sys.fileExists(fileName)

  return ({
    create(info) {
      const origResolveModuleNames = info.languageServiceHost.resolveModuleNames

      info.languageServiceHost.resolveModuleNames = (moduleNames, containingFile, reusedNames, redirectedReference, options) => {
        const newModuleNames = moduleNames.map((moduleName) => {
          if (moduleName.startsWith('.') || moduleName.startsWith('/')) {
            const modulePath = path.join(path.dirname(containingFile), moduleName)

            for (const extRegExp of EXT_REGEXPS) {
              if (extRegExp.test(moduleName) && fileExists(modulePath)) {
                return moduleName.replace(extRegExp, '')
              }
            }
          }

          return moduleName
        })

        return origResolveModuleNames.call(info.languageServiceHost, newModuleNames, containingFile, reusedNames, redirectedReference, options)
      }

      return info.languageService
    },
  })
}

module.exports = init
