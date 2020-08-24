import { isChildrenMap, getChildrenKeys } from 'autoprops'
import type { TCommonComponentConfig } from 'autoprops'
import type { TMeta } from 'syntx'
import { isDefined, isUndefined } from 'tsfn'
import type { TAnyObject, TWritable } from 'tsfn'
import { serializeElementPath } from '../../utils'

export const createChildrenMeta = (componentConfig: TCommonComponentConfig, componentPropsChildrenMap?: Readonly<TAnyObject>, metaValue: readonly string[] = []): TMeta => {
  const resultMeta: TWritable<TMeta> = {
    value: serializeElementPath(metaValue),
  }

  if (isDefined(componentPropsChildrenMap) && isChildrenMap(componentPropsChildrenMap.children)) {
    if (isUndefined(componentConfig.children)) {
      throw new Error(`childrenConfig is undefined}`)
    }

    const childrenKeys = getChildrenKeys(componentConfig).filter((key) => Reflect.has(componentPropsChildrenMap.children, key))

    if (childrenKeys.length > 0) {
      resultMeta.children = childrenKeys.map((key) => createChildrenMeta(componentConfig.children![key]!.config, componentPropsChildrenMap.children[key], [...metaValue, key]))
    }
  }

  return resultMeta
}
