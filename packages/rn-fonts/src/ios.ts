/* eslint-disable no-sync */
import path from 'path'
// @ts-ignore
import xcode from 'xcode'
import plistParser, { PlistValue } from 'plist'
import { readFile, readdir, writeFile } from 'pifs'
import { getFontPaths } from './utils'

const plistBuildOptions = {
  indent: '\t',
  offset: -1,
}

export const addFontsIos = async (projectPath: string, fontsPath: string) => {
  const fontPaths = await getFontPaths(fontsPath)
  const projectFiles = await readdir(projectPath)
  const xcodeProjectPath = projectFiles.find((file) => path.extname(file) === '.xcodeproj')

  if (typeof xcodeProjectPath !== 'string') {
    throw new Error('Unable to locate iOS project files')
  }

  const projectName = path.basename(xcodeProjectPath, '.xcodeproj')
  const plistPath = path.join(projectPath, projectName, 'Info.plist')
  const pbxprojPath = path.join(projectPath, xcodeProjectPath, 'project.pbxproj')
  const project = xcode.project(pbxprojPath).parseSync()
  const projectTargetUuid = project.getFirstTarget().uuid
  const plistData = await readFile(plistPath, 'utf8')
  const plist = plistParser.parse(plistData) as PlistValue & { UIAppFonts?: string[] }
  const firstProject = project.getFirstProject().firstProject
  const mainGroup = project.getPBXGroupByKey(firstProject.mainGroup)
  const group = mainGroup.children.find((group: any) => group.comment === 'Resources')

  if (!group) {
    const uuid = project.pbxCreateGroup('Resources', '""')

    mainGroup.children.push({
      value: uuid,
      comment: 'Resources',
    })
  }

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

  await writeFile(plistPath, `${plistParser.build(plist, plistBuildOptions)}\n`)
  await writeFile(pbxprojPath, project.writeSync())
}
