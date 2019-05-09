/* eslint-disable no-sync */
import path from 'path'
// @ts-ignore
import xcode from 'xcode'
import plistParser, { PlistValue } from 'plist'
import { getFontPaths, pReadDir, pReadFile, pWriteFile } from './utils'

const plistBuildOptions = {
  indent: '\t',
  offset: -1,
}

export const addFontsIos = async (projectPath: string, fontsPath: string) => {
  const fontPaths = await getFontPaths(fontsPath)
  const projectFiles = await pReadDir(projectPath)
  const xcodeProjectPath = projectFiles.find((file) => path.extname(file) === '.xcodeproj')

  if (typeof xcodeProjectPath !== 'string') {
    throw new Error('Unable to locate iOS project files')
  }

  const projectName = path.basename(xcodeProjectPath, '.xcodeproj')
  const plistPath = path.join(projectPath, projectName, 'Info.plist')
  const pbxprojPath = path.join(projectPath, xcodeProjectPath, 'project.pbxproj')
  const project = xcode.project(pbxprojPath).parseSync()
  const projectTargetUuid = project.getFirstTarget().uuid
  const plistData = await pReadFile(plistPath, 'utf8')
  const plist = plistParser.parse(plistData) as PlistValue & { UIAppFonts?: string[] }

  plist.UIAppFonts = plist.UIAppFonts || []

  for (const fontPath of fontPaths) {
    project.addResourceFile(
      path.relative(projectPath, fontPath),
      { target: projectTargetUuid }
    )

    const fontFilename = path.basename(fontPath)

    if (!plist.UIAppFonts.includes(fontFilename)) {
      plist.UIAppFonts.push(fontFilename)
    }
  }

  await pWriteFile(plistPath, `${plistParser.build(plist, plistBuildOptions)}\n`)
  await pWriteFile(pbxprojPath, project.writeSync())
}
