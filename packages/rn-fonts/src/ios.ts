import path from 'path'
import { readFile, readdir, writeFile } from 'pifs'
import plistParser from 'plist'
import type { PlistValue } from 'plist'
// @ts-ignore
import xcode from 'xcode'
import { getFontPaths } from './utils'

const plistBuildOptions = {
  indent: '\t',
  offset: -1,
}

export const addFontsIos = async (projectPath: string, fontsPath: string): Promise<void> => {
  const fontPaths = await getFontPaths(fontsPath)
  const projectFiles = await readdir(projectPath)
  const xcodeProjectPath = projectFiles.find((file) => path.extname(file) === '.xcodeproj')

  if (typeof xcodeProjectPath !== 'string') {
    throw new Error('Unable to locate iOS project files')
  }

  const projectName = path.basename(xcodeProjectPath, '.xcodeproj')
  const plistPath = path.join(projectPath, projectName, 'Info.plist')
  const pbxprojPath = path.join(projectPath, xcodeProjectPath, 'project.pbxproj')
  // eslint-disable-next-line node/no-sync
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
  // eslint-disable-next-line node/no-sync
  await writeFile(pbxprojPath, project.writeSync())
}
