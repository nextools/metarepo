import { getChildrenKeys } from 'autoprops'
import type { TCommonComponentConfig } from 'autoprops'
import { isUndefined } from 'tsfn'
import { getComponentName } from '../../utils'

export const getChildDisplayName = (componentConfig: TCommonComponentConfig, childPath: readonly string[], currentChildIndex: number) => {
  let childDisplayName = 'YourMainComponent'
  let parentConfig = componentConfig
  let childConfig = componentConfig

  for (let i = 0; i <= currentChildIndex; i++) {
    const name = childPath[i]

    if (isUndefined(childConfig.children)) {
      throw new Error(`Path contains name '${name}', but '${childDisplayName}' config.children is undefined`)
    }

    if (isUndefined(childConfig.children[name])) {
      throw new Error(`Path contains name '${name}', but '${childDisplayName}' config.children[${name}] is undefined`)
    }

    childDisplayName = getComponentName(childConfig.children[name]!.Component)
    parentConfig = childConfig
    childConfig = childConfig.children[name]!.config
  }

  let childDisplayNameIndex = 0

  for (const childKey of getChildrenKeys(parentConfig)) {
    if (childKey === childPath[currentChildIndex]) {
      break
    }

    if (getComponentName(parentConfig.children![childKey]!.Component) === childDisplayName) {
      ++childDisplayNameIndex
    }
  }

  return {
    childDisplayNameIndex,
    childDisplayName,
  }
}
