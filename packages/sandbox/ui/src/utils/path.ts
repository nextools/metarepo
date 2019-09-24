import { TPath } from 'syntx'
import { TMetaFile, isChildrenMap } from 'autoprops'
import { getComponentName } from 'refun'
import { isUndefined, TAnyObject } from 'tsfn'

export const clampSyntxPath = (rootMetaFile: TMetaFile, path: TPath): TPath => {
  if (path[0].name !== getComponentName(rootMetaFile.Component)) {
    throw new Error(`Component display name ${getComponentName(rootMetaFile.Component)} does not match path ${path[0].name}`)
  }

  let childMeta = rootMetaFile

  for (let i = 1; i < path.length; ++i) {
    const { name } = path[i]

    if (isUndefined(childMeta.childrenConfig)) {
      return path.slice(1, i)
    }

    const nextChildMeta = Object.values(childMeta.childrenConfig.meta).find(({ Component }) => getComponentName(Component) === name)

    if (isUndefined(nextChildMeta)) {
      throw new Error(`Path contains name '${name}', which wasn't found in childConfig.meta of ${getComponentName(childMeta.Component)} meta`)
    }

    childMeta = nextChildMeta
  }

  return path.slice(1)
}

const pathCache = new Map<string, TPath>([['', []]])

export const serializeSyntxPath = (path: TPath): string => {
  const serializedPath = path.reduce((result, { name, index }) => {
    return result.length > 0 ? `${result}--${name}-${index}` : `${name}-${index}`
  }, '')

  if (!pathCache.has(serializedPath)) {
    pathCache.set(serializedPath, path)
  }

  return serializedPath
}

export const getMetaByPath = (rootMetaFile: TMetaFile, componentPropsChildrenMap: TAnyObject, serializedPath: string) => {
  if (!pathCache.has(serializedPath)) {
    console.error(`Cache miss for ${serializedPath}`)

    return {
      componentMetaFile: rootMetaFile,
      componentProps: componentPropsChildrenMap,
      propPath: [] as string[],
    }
  }

  const path = pathCache.get(serializedPath)!

  let childrenProps = componentPropsChildrenMap
  let propPath: string[] = []
  let childMeta = rootMetaFile

  for (const { index, name } of path) {
    if (isUndefined(childMeta.childrenConfig)) {
      throw new Error(`Path contains name '${name}', but meta.childrenConfig is undefined`)
    }

    if (!isChildrenMap(childrenProps.children)) {
      throw new Error(`childrenMap is invalid for ${serializedPath} at ${name}`)
    }

    const nextChildMeta = Object.values(childMeta.childrenConfig.meta).find(({ Component }) => getComponentName(Component) === name)
    const childrenKeys = Object.keys(childrenProps.children)
    const nextPropsKey = childrenKeys[index]

    if (isUndefined(nextPropsKey)) {
      throw new Error(`path ${serializedPath} is invalid for ${JSON.stringify(componentPropsChildrenMap)}`)
    }

    if (isUndefined(nextChildMeta)) {
      throw new Error(`Path contains name '${name}', which wasn't found in childConfig.meta`)
    }

    childMeta = nextChildMeta
    childrenProps = childrenProps.children[nextPropsKey] as TAnyObject
    propPath = [...propPath, 'children', nextPropsKey]
  }

  return {
    componentMetaFile: childMeta,
    componentProps: childrenProps,
    propPath,
  }
}
