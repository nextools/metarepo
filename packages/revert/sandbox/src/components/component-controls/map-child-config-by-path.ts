import { isChildrenMap } from 'autoprops'
import type { TCommonComponentConfig } from 'autoprops'
import { pipe } from 'funcom'
import { startWithType, mapWithProps } from 'refun'
import { isUndefined, isDefined } from 'tsfn'
import type { TAnyObject } from 'tsfn'
import { mapMetaStoreState } from '../../store-meta'
import type { TCommonComponentControls, TMetaFile } from '../../types'
import { getComponentName, getElementPath } from '../../utils'

export type TMapChildConfigByPathResult = {
  childConfig: TCommonComponentConfig | null,
  childControls: TCommonComponentControls | null,
  childDisplayName: string,
  childPropsChildrenMap: Readonly<TAnyObject>,
  childPath: readonly string[],
}

const isMetaFile = (obj: any): obj is TMetaFile => isDefined(obj.config) && isDefined(obj.Component)
const getControlsFromMeta = (obj: any): TCommonComponentControls | null => (isMetaFile(obj) ? obj.controls : null) ?? null

export const mapChildConfigByPath = <P>() => pipe(
  startWithType<P>(),
  mapMetaStoreState(({ componentConfig, componentControls, componentPropsChildrenMap, selectedElementPath }) => ({
    componentConfig,
    componentControls,
    componentPropsChildrenMap,
    selectedElementPath,
  }), ['componentConfig', 'componentControls', 'componentPropsChildrenMap', 'selectedElementPath']),
  mapWithProps(({ componentConfig, componentControls, componentPropsChildrenMap, selectedElementPath }): TMapChildConfigByPathResult => {
    if (componentConfig === null) {
      return {
        childConfig: null,
        childControls: null,
        childDisplayName: '',
        childPropsChildrenMap: {},
        childPath: [],
      }
    }

    let childDisplayName = 'RootComponent'
    let childConfig = componentConfig
    let childControls = componentControls
    let childPropsChildrenMap = componentPropsChildrenMap
    const childPath = getElementPath(selectedElementPath)

    for (const name of childPath) {
      if (isUndefined(childConfig.children)) {
        throw new Error(`Path contains name '${name}', but '${childDisplayName}' config.children is undefined`)
      }

      if (!isChildrenMap(childPropsChildrenMap.children)) {
        throw new Error(`childrenMap is invalid for "${name}", path "${selectedElementPath}"`)
      }

      if (isUndefined(childPropsChildrenMap.children[name])) {
        throw new Error(`childrenMap does not contain "${name}", path "${selectedElementPath}"`)
      }

      const childMeta = childConfig.children[name]

      if (isUndefined(childMeta)) {
        throw new Error(`Path contains name '${name}', but '${childDisplayName}' config.children[${name}] is undefined`)
      }

      childDisplayName = getComponentName(childMeta.Component)
      childConfig = childMeta.config
      childControls = getControlsFromMeta(childMeta)
      childPropsChildrenMap = childPropsChildrenMap.children[name]! // undefined checked
    }

    return {
      childConfig,
      childControls,
      childPropsChildrenMap,
      childDisplayName,
      childPath,
    }
  })
)
