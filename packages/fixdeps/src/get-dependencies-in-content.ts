import traverse from '@babel/traverse'
import { isString } from 'tsfn'
import { detect } from './detect'
import { getPackageName } from './get-package-name'
import { parse } from './parse'

export const getDependenciesInContent = (content: string): string[] => {
  const ast = parse(content)
  const dependencies: string[] = []

  traverse(ast, {
    enter(path: any) {
      const value = detect(path.node)

      if (value !== null) {
        const packageName = getPackageName(value)

        if (isString(packageName) && !dependencies.includes(packageName)) {
          dependencies.push(packageName)
        }
      }
    },
  })

  return dependencies
}
