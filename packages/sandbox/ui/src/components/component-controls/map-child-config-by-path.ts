import { isChildrenMap, TComponentConfig } from 'autoprops'
import { isUndefined, TAnyObject } from 'tsfn'
import { pipe } from '@psxcode/compose'
import { startWithType, mapWithProps } from 'refun'
import { getComponentName, getElementPath } from '../../utils'

export type TMapChildConfigByPath = {
  componentConfig: TComponentConfig,
  componentPropsChildrenMap: Readonly<TAnyObject>,
  selectedElementPath: string,
}

export type TMapChildConfigByPathResult = {
  childConfig: TComponentConfig,
  childDisplayName: string,
  childPropsChildrenMap: Readonly<TAnyObject>,
  childPath: readonly string[],
}

export const mapChildConfigByPath = <P extends TMapChildConfigByPath>() => pipe(
  startWithType<P & TMapChildConfigByPath>(),
  mapWithProps(({ componentConfig, componentPropsChildrenMap, selectedElementPath }): TMapChildConfigByPathResult => {
    let childDisplayName = 'RootComponent'
    let childConfig = componentConfig
    let childPropsChildrenMap = componentPropsChildrenMap
    const childPath = getElementPath(selectedElementPath)

    for (const name of childPath) {
      if (isUndefined(childConfig.children)) {
        throw new Error(`Path contains name '${name}', but '${childDisplayName}' config.children is undefined`)
      }

      if (isUndefined(childConfig.children[name])) {
        throw new Error(`Path contains name '${name}', but '${childDisplayName}' config.children[${name}] is undefined`)
      }

      if (!isChildrenMap(childPropsChildrenMap.children)) {
        throw new Error(`childrenMap is invalid for "${name}", path "${selectedElementPath}"`)
      }

      if (isUndefined(childPropsChildrenMap.children[name])) {
        throw new Error(`childrenMap does not contain "${name}", path "${selectedElementPath}"`)
      }

      childDisplayName = getComponentName(childConfig.children[name].Component)
      childConfig = childConfig.children[name].config
      childPropsChildrenMap = childPropsChildrenMap.children[name]! // undefined checked
    }

    return {
      childConfig,
      childPropsChildrenMap,
      childDisplayName,
      childPath,
    }
  })
)
