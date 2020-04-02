import path from 'path'
import { readFile, writeFile } from 'pifs'
import execa from 'execa'
import moveFile from 'move-file'
import { getAndroidAppPath } from './get-android-app-path'

export type TBuildAndroidAppDebugOptions = {
  projectPath: string,
  appName: string,
  appId: string,
}

export const buildAndroidAppDebug = async (options: TBuildAndroidAppDebugOptions): Promise<void> => {
  await execa(
    path.resolve(options.projectPath, 'gradlew'),
    [
      'clean',
      '--console=plain',
      '--quiet',
      '--no-daemon',
      '--warning-mode=none',
    ],
    {
      cwd: options.projectPath,
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
      },
    }
  )

  const stringsXmlPath = path.join(options.projectPath, 'app', 'src', 'main', 'res', 'values', 'strings.xml')

  await writeFile(stringsXmlPath, `<resources><string name="app_name">${options.appName}</string></resources>`)

  const buildGradlePath = path.join(options.projectPath, 'app', 'build.gradle')

  let buildGradleData = await readFile(buildGradlePath, 'utf8')

  buildGradleData = buildGradleData.replace('applicationId "com.rebox"', `applicationId "${options.appId}"`)

  await writeFile(buildGradlePath, buildGradleData)

  await execa(
    path.resolve(options.projectPath, 'gradlew'),
    [
      'assembleDebug',
      '--console=plain',
      '--quiet',
      '--no-daemon',
      '--warning-mode=none',
      '-PreactNativeDevServerPort=8082',
    ],
    {
      cwd: options.projectPath,
      stderr: process.stderr,
      env: {
        FORCE_COLOR: '1',
      },
    }
  )

  await writeFile(stringsXmlPath, '<resources><string name="app_name">rebox</string></resources>')

  const originalApkPath = path.join(options.projectPath, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')
  const newApkPath = getAndroidAppPath(options.appName)

  await moveFile(originalApkPath, newApkPath)
}
