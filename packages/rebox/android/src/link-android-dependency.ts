import path from 'path'
import { readFile, writeFile, readdir } from 'pifs'

export type TLinkAndroidDependencyOptions = {
  projectPath: string,
  dependencyName: string,
}

const getDependencyAndroidSourcePath = async (dependencyPath: string): Promise<string> => {
  try {
    const reactNativeConfig = await import(path.resolve(dependencyPath, 'react-native.config.js'))

    return path.join(dependencyPath, reactNativeConfig.dependency.platforms.android.sourceDir)
  } catch {
    return path.join(dependencyPath, 'android')
  }
}

export const linkAndroidDependency = async (options: TLinkAndroidDependencyOptions): Promise<void> => {
  const dependencyPath = path.join('node_modules', options.dependencyName)
  const dependencyAndroidSourcePath = await getDependencyAndroidSourcePath(dependencyPath)

  // settings.gradle
  const settingsGradlePath = path.join(options.projectPath, 'settings.gradle')
  const dependencySettingsGradlePath = path.relative(options.projectPath, dependencyAndroidSourcePath)
  let settingGradleData = await readFile(settingsGradlePath, { encoding: 'utf8' })

  settingGradleData = settingGradleData.replace('// REBOX', `include ':${options.dependencyName}'\nproject(':${options.dependencyName}').projectDir = new File(rootProject.projectDir, '${dependencySettingsGradlePath}')\n// REBOX`)

  await writeFile(settingsGradlePath, settingGradleData)

  // app/build.gradle
  const buildGradlePath = path.join(options.projectPath, 'app', 'build.gradle')
  let buildGradleData = await readFile(buildGradlePath, { encoding: 'utf8' })

  buildGradleData = buildGradleData.replace('// REBOX', `implementation project(':${options.dependencyName}')\n    // REBOX`)

  await writeFile(buildGradlePath, buildGradleData)

  // app/src/main/java/com/rebox/MainApplication.java
  const dependencyManifestPath = path.join(dependencyAndroidSourcePath, 'src', 'main', 'AndroidManifest.xml')
  const dependencyManifestData = await readFile(dependencyManifestPath, { encoding: 'utf8' })
  const packageId = /package="(.+)"/.exec(dependencyManifestData)![1]
  const packageDirFiles = await readdir(path.join(dependencyAndroidSourcePath, 'src', 'main', 'java', ...packageId.split('.')))
  const packageName = packageDirFiles.find((filename) => filename.endsWith('Package.java'))!.replace('.java', '')
  const mainApplicationJavaPath = path.join(options.projectPath, 'app', 'src', 'main', 'java', 'com', 'rebox', 'MainApplication.java')
  let mainApplicationJavaData = await readFile(mainApplicationJavaPath, { encoding: 'utf8' })

  mainApplicationJavaData = mainApplicationJavaData
    .replace('// REBOX_IMPORT', `import ${packageId}.${packageName};\n// REBOX_IMPORT`)
    .replace('// REBOX_PACKAGE', `packages.add(new ${packageName}());\n      // REBOX_PACKAGE`)

  await writeFile(mainApplicationJavaPath, mainApplicationJavaData)
}
