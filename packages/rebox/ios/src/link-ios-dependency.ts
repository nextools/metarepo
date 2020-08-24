import path from 'path'
import { readdir, readFile, writeFile } from 'pifs'

export type TLinkIosDependencyOptions = {
  projectPath: string,
  dependencyName: string,
}

export const linkIosDependency = async (options: TLinkIosDependencyOptions): Promise<void> => {
  const dependencyPath = path.join('node_modules', options.dependencyName)
  const dependencyPodfilePath = path.relative(options.projectPath, dependencyPath)
  const packageDirFiles = await readdir(dependencyPath)
  const podSpecName = packageDirFiles.find((filename) => filename.endsWith('.podspec'))!.replace('.podspec', '')
  const podfilePath = path.join(options.projectPath, 'Podfile')
  let podfileData = await readFile(podfilePath, { encoding: 'utf8' })

  podfileData = podfileData.replace('# REBOX', `pod '${podSpecName}', :path => '${dependencyPodfilePath}'\n  # REBOX`)

  await writeFile(podfilePath, podfileData)
}
