import path from 'path'
import { promisify } from 'util'
import { readFile, writeFile } from 'graceful-fs'
import execa from 'execa'
import moveFile from 'move-file'

const pReadFile = promisify(readFile)
const pWriteFile = promisify(writeFile)

export type TBuildDebugOptions = {
  projectPath: string,
  appName: string,
  appId: string,
  outputPath: string,
}

export const buildDebug = async (options: TBuildDebugOptions) => {
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

  await pWriteFile(stringsXmlPath, `<resources><string name="app_name">${options.appName}</string></resources>`)

  const buildGradlePath = path.join(options.projectPath, 'app', 'build.gradle')

  let buildGradleData = await pReadFile(buildGradlePath, 'utf8')

  buildGradleData = buildGradleData.replace('applicationId "com.rebox"', `applicationId "${options.appId}"`)

  await pWriteFile(buildGradlePath, buildGradleData)

  await execa(
    path.resolve(options.projectPath, 'gradlew'),
    [
      'assembleDebug',
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

  await pWriteFile(stringsXmlPath, '<resources><string name="app_name">rebox</string></resources>')

  const originalApkPath = path.join(options.projectPath, 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk')
  const newApkPath = path.join(options.outputPath, `${options.appName}.apk`)

  await moveFile(originalApkPath, newApkPath)
}
