import {
  linkConfig,
  projectConfig as getProjectConfig,
  dependencyConfig as getDepConfig,
  // @ts-ignore
} from '@react-native-community/cli-platform-ios'

export type TLinkDependencyIos = {
  projectPath: string,
  dependencyPath: string,
}

export const linkDependencyIos = ({ projectPath, dependencyPath }: TLinkDependencyIos) => {
  const projectConfig = getProjectConfig(projectPath, {})
  const depConfig = getDepConfig(dependencyPath, {})
  const { register, unregister } = linkConfig()

  unregister(null, depConfig, projectConfig, [])
  register(null, depConfig, null, projectConfig)
}
