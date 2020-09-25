import path from 'path'
import moveFile from 'move-file'
import { readFile, writeFile } from 'pifs'
import { spawnChildProcess } from 'spown'
import { getAndroidAppPath } from './get-android-app-path'

export type TBuildAndroidAppDebugOptions = {
  projectPath: string,
  appName: string,
  appId: string,
}

export const buildAndroidAppDebug = async (options: TBuildAndroidAppDebugOptions): Promise<void> => {
  await spawnChildProcess(
    `${path.resolve(options.projectPath, 'gradlew')} clean --console=plain --quiet --no-daemon --warning-mode=none`,
    {
      cwd: options.projectPath,
      stdout: null,
      stderr: process.stderr,
    }
  )

  const stringsXmlPath = path.join(options.projectPath, 'app', 'src', 'main', 'res', 'values', 'strings.xml')

  await writeFile(stringsXmlPath, `<resources><string name="app_name">${options.appName}</string></resources>`)

  const buildGradlePath = path.join(options.projectPath, 'app', 'build.gradle')

  let buildGradleData = await readFile(buildGradlePath, 'utf8')

  buildGradleData = buildGradleData.replace('applicationId "com.rebox"', `applicationId "${options.appId}"`)

  await writeFile(buildGradlePath, buildGradleData)

  await spawnChildProcess(
    `${path.resolve(options.projectPath, 'gradlew')} assembleDebug --console=plain --quiet --no-daemon --warning-mode=none -PreactNativeDevServerPort=8082`,
    {
      cwd: options.projectPath,
      stdout: null,
      stderr: process.stderr,
    }
  )

  await writeFile(stringsXmlPath, '<resources><string name="app_name">rebox</string></resources>')

  const originalApkPath = path.join(options.projectPath, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')
  const newApkPath = getAndroidAppPath(options.appName)

  await moveFile(originalApkPath, newApkPath)
}
