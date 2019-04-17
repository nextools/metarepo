import traverse from '@babel/traverse'
import { parse, getPackageName, detect, isString } from './utils'

export const getDependenciesInContent = (content: string): string[] => {
  const ast = parse(content)
  const dependencies = new Set<string>()

  traverse(ast, {
    enter(path: any) {
      const value = detect(path.node)

      if (value !== null) {
        const packageName = getPackageName(value)

        if (isString(packageName)) {
          dependencies.add(packageName)
        }
      }
    },
  })

  return Array.from(dependencies)
}
