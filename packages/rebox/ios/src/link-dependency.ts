import path from 'path'
import { readdir, readFile, writeFile } from 'pifs'

export type TLinkDependency = {
  projectPath: string,
  dependencyName: string,
}

export const linkDependency = async ({ dependencyName, projectPath }: TLinkDependency): Promise<void> => {
  const dependencyPath = path.join('node_modules', dependencyName)
  const dependencyPodfilePath = path.relative(projectPath, dependencyPath)
  const packageDirFiles = await readdir(dependencyPath)
  const podSpecName = packageDirFiles.find((filename) => filename.endsWith('.podspec'))!.replace('.podspec', '')
  const podfilePath = path.join(projectPath, 'Podfile')
  let podfileData = await readFile(podfilePath, { encoding: 'utf8' })

  podfileData = podfileData.replace('# REBOX', `pod '${podSpecName}', :path => '${dependencyPodfilePath}'\n  # REBOX`)

  await writeFile(podfilePath, podfileData)
}
