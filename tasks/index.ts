/* eslint-disable import/no-extraneous-dependencies */
import plugin from '@start/plugin'

export * from '@bubble-dev/start-preset'

// custom tasks:
export const fixDeps = () => plugin('fixDeps', ({ logPath, logMessage }) => async () => {
  const { fixdeps } = await import('fixdeps')
  const { getPackageDirs } = await import('@auto/fs')
  const packages = await getPackageDirs()

  for (const pkg of packages) {
    const result = await fixdeps({
      ignoredPackages: [
        '@babel/core',
        '@babel/runtime',
        '__REBOX_ENTRY_POINT__',
        '@typescript-eslint/eslint-plugin',
        '@typescript-eslint/parser',
        'eslint-plugin-import',
        'eslint-plugin-react',
        'eslint',
        'typescript',
        'react-dom',
        'react-hot-loader',
        'request',
      ],
      packagePath: pkg,
      dependencyFilesGlobs: ['src/**/*.{ts,tsx,js}'],
      devDependencyFilesGlobs: ['test/**/*.{ts,tsx,js}', 'meta.{ts,tsx}'],
    })

    if (result !== null) {
      logPath(pkg)

      const addedDeps = Object.keys(result.addedDeps)
      const addedDevDeps = Object.keys(result.addedDevDeps)

      if (addedDeps.length > 0) {
        logMessage(`added deps: ${addedDeps.join(', ')}`)
      }

      if (addedDevDeps.length > 0) {
        logMessage(`added devDeps: ${addedDevDeps.join(', ')}`)
      }

      if (result.removedDeps.length > 0) {
        logMessage(`removed deps: ${result.removedDeps.join(', ')}`)
      }
    }
  }
})
