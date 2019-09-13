import path from 'path'
import { readFile, writeFile, readdir } from 'pifs'

export type TLinkDependency = {
  projectPath: string,
  dependencyName: string,
}

export const linkDependency = async ({ projectPath, dependencyName }: TLinkDependency) => {
  const dependencyPath = path.join('node_modules', dependencyName)

  // settings.gradle
  const settingsGradlePath = path.join(projectPath, 'settings.gradle')
  const dependencySettingsGradlePath = path.relative(projectPath, dependencyPath)
  let settingGradleData = await readFile(settingsGradlePath, { encoding: 'utf8' })

  settingGradleData = settingGradleData.replace('// REBOX', `include ':${dependencyName}'\nproject(':${dependencyName}').projectDir = new File(rootProject.projectDir, '${dependencySettingsGradlePath}/android')\n// REBOX`)

  await writeFile(settingsGradlePath, settingGradleData)

  // app/build.gradle
  const buildGradlePath = path.join(projectPath, 'app', 'build.gradle')
  let buildGradleData = await readFile(buildGradlePath, { encoding: 'utf8' })

  buildGradleData = buildGradleData.replace('// REBOX', `implementation project(':${dependencyName}')\n    // REBOX`)

  await writeFile(buildGradlePath, buildGradleData)

  // app/src/main/java/com/rebox/MainApplication.java
  const dependencyManifestPath = path.join(dependencyPath, 'android', 'src', 'main', 'AndroidManifest.xml')
  const dependencyManifestData = await readFile(dependencyManifestPath, { encoding: 'utf8' })
  const packageId = /package="(.+)"/.exec(dependencyManifestData)![1]
  const packageDirFiles = await readdir(path.join(dependencyPath, 'android', 'src', 'main', 'java', ...packageId.split('.')))
  const packageName = packageDirFiles.find((filename) => filename.endsWith('Package.java'))!.replace('.java', '')
  const mainApplicationJavaPath = path.join(projectPath, 'app', 'src', 'main', 'java', 'com', 'rebox', 'MainApplication.java')
  let mainApplicationJavaData = await readFile(mainApplicationJavaPath, { encoding: 'utf8' })

  mainApplicationJavaData = mainApplicationJavaData
    .replace('// REBOX_IMPORT', `import ${packageId}.${packageName};\n// REBOX_IMPORT`)
    .replace('// REBOX_PACKAGE', `packages.add(new ${packageName}());\n      // REBOX_PACKAGE`)

  await writeFile(mainApplicationJavaPath, mainApplicationJavaData)
}
