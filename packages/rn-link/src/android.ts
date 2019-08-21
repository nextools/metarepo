import path from 'path'
// @ts-ignore
import { linkConfig, projectConfig as getProjectConfig, dependencyConfig as getDepConfig } from '@react-native-community/cli-platform-android'

export type TLinkDependencyAndroid = {
  projectPath: string,
  dependencyName: string,
  dependencyPath: string,
}

export const linkDependencyAndroid = ({ projectPath, dependencyName, dependencyPath }: TLinkDependencyAndroid) => {
  const parentPath = path.join(projectPath, '..')
  const projectConfig = getProjectConfig(parentPath, {})
  const depConfig = getDepConfig(dependencyPath, {})
  const { register, unregister } = linkConfig()

  unregister(dependencyName, depConfig, projectConfig)
  register(dependencyName, depConfig, {}, projectConfig)
}
