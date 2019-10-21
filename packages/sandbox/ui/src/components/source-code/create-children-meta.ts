import { TAnyObject, TWritable, isDefined, isUndefined } from 'tsfn'
import { TMeta } from 'syntx'
import { isChildrenMap, getChildrenKeys, TComponentConfig } from 'autoprops'
import { serializeElementPath } from '../../utils'

export const createChildrenMeta = (componentConfig: TComponentConfig, componentPropsChildrenMap?: Readonly<TAnyObject>, metaValue: readonly string[] = []): TMeta => {
  const resultMeta: TWritable<TMeta> = {
    value: serializeElementPath(metaValue),
  }

  if (isDefined(componentPropsChildrenMap) && isChildrenMap(componentPropsChildrenMap.children)) {
    if (isUndefined(componentConfig.children)) {
      throw new Error(`childrenConfig is undefined}`)
    }

    const childrenKeys = getChildrenKeys(componentConfig).filter((key) => Reflect.has(componentPropsChildrenMap.children, key))

    if (childrenKeys.length > 0) {
      resultMeta.children = childrenKeys.map((key) => createChildrenMeta(componentConfig.children![key].config, componentPropsChildrenMap.children[key], [...metaValue, key]))
    }
  }

  return resultMeta
}
