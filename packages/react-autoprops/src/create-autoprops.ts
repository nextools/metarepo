/* eslint-disable no-use-before-define */
import { FC } from 'react'
import { PropsWithValues, AutoConfig, Keys, getPermutations, getProps, getKeys, getFilenames, Permutation } from 'autoprops'
import { getObjectKeys, isUndefined, TAnyObject } from 'tsfn'
import { TComponentConfig, TMetaFile } from './types'
import { getIndexedName } from './get-indexed-name'

const getComponentName = (fc: FC<any>): string => fc.displayName || fc.name

const createPropsWithValues = (config: TComponentConfig): PropsWithValues<any> => {
  if (Array.isArray(config.required)) {
    return getObjectKeys(config.props).reduce((result, key) => {
      if (Array.isArray(config.required) && config.required.includes(key)) {
        result[key] = config.props[key]
      } else {
        result[key] = [undefined, ...config.props[key]]
      }

      return result
    }, {} as PropsWithValues<any>)
  }

  return config.props
}

const makeAutopropsConfig = (config: TComponentConfig): AutoConfig<any> => {
  return {
    props: createPropsWithValues(config),
    mutex: config.mutex,
  }
}

type TAutopropsConfigCache<T> = {
  props: PropsWithValues<T>,
  keys: Keys<T>,
  perms: Permutation<T>[],
}

const autopropsConfigCache = new Map<string, TAutopropsConfigCache<any>>()
const autopropsCache = new Map<string, any[]>()
const filenamesCache = new Map<string, string[]>()

export const createAutopropsConfig = ({ Component, config, childrenConfig }: TMetaFile): TAutopropsConfigCache<any> => {
  const displayName = getComponentName(Component)

  if (autopropsConfigCache.has(displayName)) {
    return autopropsConfigCache.get(displayName)!
  }

  if (!isUndefined(childrenConfig)) {
    const childrenMutex = Array.isArray(childrenConfig.mutex) ? [...childrenConfig.mutex] : []
    const { props: childrenPropsWithValues, mutex: childrenMutexGroups, keys: childrenKeys } = childrenConfig.children.reduce((result, childKey) => {
      const childMeta = childrenConfig.meta[childKey]
      const childAutoprops = createAutoprops(childMeta)
      const currentKeys = Object.keys(result.props)
      const childIndexedKey = getIndexedName(currentKeys, childKey)

      if (Array.isArray(childrenConfig.required) && childrenConfig.required.includes(childKey)) {
        result.props[childIndexedKey] = childAutoprops
      } else {
        result.props[childIndexedKey] = [undefined, ...childAutoprops]
      }

      result.keys.push(childIndexedKey)

      result.mutex.push(...result.mutex.reduce((result, mutex) => {
        if (mutex.includes(childKey)) {
          result.push(mutex.map((key) => (key === childKey ? childIndexedKey : key)))
        }

        return result
      }, [] as string[][]))

      return result
    }, { props: {}, mutex: childrenMutex, keys: [] as any } as {
      props: PropsWithValues<TAnyObject>,
      mutex: string[][],
      keys: Keys<TAnyObject>,
    })

    const childrenPerms = getPermutations(childrenPropsWithValues, childrenKeys, childrenMutexGroups)
    const childrenGeneratedProps = getProps(childrenPropsWithValues, childrenKeys, childrenPerms)

    const componentConfig = {
      ...config,
      props: {
        ...config.props,
        children: childrenGeneratedProps,
      },
    }

    const autopropsConfig = makeAutopropsConfig(componentConfig)
    const autopropsKeys = getKeys(autopropsConfig.props)
    const autopropsPerms = getPermutations(autopropsConfig.props, autopropsKeys, autopropsConfig.mutex)
    const result: TAutopropsConfigCache<any> = {
      props: autopropsConfig.props,
      keys: autopropsKeys,
      perms: autopropsPerms,
    }

    autopropsConfigCache.set(displayName, result)

    return result
  }

  const autopropsConfig = makeAutopropsConfig(config)
  const autopropsKeys = getKeys(autopropsConfig.props)
  const autopropsPerms = getPermutations(autopropsConfig.props, autopropsKeys, autopropsConfig.mutex)
  const result: TAutopropsConfigCache<any> = {
    props: autopropsConfig.props,
    keys: autopropsKeys,
    perms: autopropsPerms,
  }

  autopropsConfigCache.set(displayName, result)

  return result
}

export const createAutoprops = (metaFile: TMetaFile): any[] => {
  const displayName = getComponentName(metaFile.Component)

  if (autopropsCache.has(displayName)) {
    return autopropsCache.get(displayName)!
  }

  const { props, keys, perms } = createAutopropsConfig(metaFile)
  const result = getProps(props, keys, perms)

  autopropsCache.set(displayName, result)

  return result
}

export const createAutopropsFilenames = (metaFile: TMetaFile): string[] => {
  const displayName = getComponentName(metaFile.Component)

  if (filenamesCache.has(displayName)) {
    return filenamesCache.get(displayName)!
  }

  const { props, keys, perms } = createAutopropsConfig(metaFile)
  const result = getFilenames(props, keys, perms)

  filenamesCache.set(displayName, result)

  return result
}
