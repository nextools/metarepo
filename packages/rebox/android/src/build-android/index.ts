import path from 'path'
import { promisify } from 'util'
import { writeFile } from 'graceful-fs'
import execa from 'execa'
import moveFile from 'move-file'

const pWriteFile = promisify(writeFile)

export type TBuildAndroidOptions = {
  entryPointPath: string,
  appName: string,
  outputPath: string,
}

export const buildAndroid = async (options: TBuildAndroidOptions) => {
  const androidPath = path.join('node_modules', '@rebox', 'android', 'android')

  await execa(
    'haul',
    [
      'bundle',
      '--config',
      require.resolve('./haul.config.js'),
      '--platform',
      'android',
      '--dev',
      'false',
      '--minify',
      'true',
      '--progress',
      'none',
      '--bundle-output',
      path.join(androidPath, 'app', 'src', 'main', 'assets', 'index.android.bundle'),
    ],
    {
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
        REBOX_ENTRY_POINT: options.entryPointPath,
      },
    }
  )

  await execa(
    path.resolve(androidPath, 'gradlew'),
    [
      'clean',
      '--console=plain',
      '--quiet',
      '--no-daemon',
      '--warning-mode=none',
    ],
    {
      cwd: androidPath,
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
      },
    }
  )

  const stringsXmlPath = path.join(androidPath, 'app', 'src', 'main', 'res', 'values', 'strings.xml')

  await pWriteFile(stringsXmlPath, `<resources><string name="app_name">${options.appName}</string></resources>`)

  await execa(
    path.resolve(androidPath, 'gradlew'),
    [
      'assemble',
      '--console=plain',
      '--quiet',
      '--no-daemon',
      '--warning-mode=none',
    ],
    {
      cwd: androidPath,
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
      },
    }
  )

  await pWriteFile(stringsXmlPath, '<resources><string name="app_name">rebox</string></resources>')

  const originalApkPath = path.join(androidPath, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')
  const newApkPath = path.join(options.outputPath, `${options.appName}.apk`)

  await moveFile(originalApkPath, newApkPath)
}
