import plugin from '@start/plugin'
import overwrite from '@start/plugin-overwrite'
import sequence from '@start/plugin-sequence'
import find from '@start/plugin-find'
import read from '@start/plugin-read'
import eslint from '@start/plugin-lib-eslint'

export const fixLint = () =>
  sequence(
    find([
      'packages/**/{src,test,x-ray}/**/*.{ts,tsx}',
      'tasks/**/*.ts',
    ]),
    read,
    eslint({
      fix: true,
      cache: true,
      cacheLocation: 'node_modules/.cache/eslint',
    }),
    overwrite
  )

export const fixDeps = () => plugin('fixDeps', ({ logPath, logMessage }) => async () => {
  const { fixdeps } = await import('fixdeps')
  const { getPackageDirs } = await import('@auto/fs')
  const packages = await getPackageDirs()

  for (const pkg of packages) {
    const result = await fixdeps({
      ignoredPackages: [
        '@babel/core',
        '@babel/runtime',
        '@babel/runtime-corejs3',
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
        'core-js',
      ],
      packagePath: pkg,
      dependencyFilesGlobs: ['src/**/*.{ts,tsx,js}'],
      devDependencyFilesGlobs: ['{test,x-ray}/**/*.{ts,tsx,js}', 'meta.{ts,tsx}'],
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
