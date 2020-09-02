import path from 'path'
import { readFile, readdir } from 'pifs'

const JAVA_REGEXP = /public\s+class\s+(.+?)\s+implements\s+ReactPackage/
const KOTLIN_REGEXP = /class\s+(.+?)\s+:\s+ReactPackage/

export const getPackageClassName = async (dependencyAndroidSourcePath: string, packageId: string): Promise<string | null> => {
  const packageDir = path.join(dependencyAndroidSourcePath, 'src', 'main', 'java', ...packageId.split('.'))
  const files = await readdir(packageDir)

  for (const file of files) {
    if (file.endsWith('.java') || file.endsWith('.kt')) {
      const filePath = path.join(packageDir, file)
      const data = await readFile(filePath, 'utf8')

      let matches = null

      if (file.endsWith('.java')) {
        matches = data.match(JAVA_REGEXP)
      } else if (file.endsWith('.kt')) {
        matches = data.match(KOTLIN_REGEXP)
      }

      if (matches !== null) {
        return matches[1]
      }
    }
  }

  return null
}
