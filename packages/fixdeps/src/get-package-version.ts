import { getLocalPackageVersionYarn } from './get-local-package-version-yarn'
import { getRemotePackageVersionNpm } from './get-remote-package-version-npm'

const cachedVersions = new Map<string, Promise<string>>()

const fetchVersion = async (name: string) => {
  const yarnVersion = await getLocalPackageVersionYarn(name)

  if (yarnVersion !== null) {
    return yarnVersion
  }

  const npmVersion = await getRemotePackageVersionNpm(name)

  return npmVersion
}

export const getPackageVersion = (name: string): Promise<string> => {
  if (cachedVersions.has(name)) {
    return cachedVersions.get(name)!
  }

  const result = fetchVersion(name)

  cachedVersions.set(name, result)

  return result
}
