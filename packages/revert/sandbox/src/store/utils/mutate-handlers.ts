import { isChildrenMap } from 'autoprops'
import type { TCommonComponentConfig } from 'autoprops'
import { isFunction } from 'tsfn'
import type { TAnyObject } from 'tsfn'
import { consoleLog } from '../../store-console'
import { isHandler, getComponentName } from '../../utils'

export const mutateHandlers = (props: Readonly<TAnyObject>, prefix: string, componentConfig: TCommonComponentConfig) => {
  for (const key of Object.keys(props)) {
    if (key === 'children') {
      continue
    }

    if (isHandler(key) && isFunction(props[key])) {
      const origHandler = props[key]

      ;(props as TAnyObject)[key] = (...args: any[]) => {
        origHandler(...args)
        consoleLog(prefix + key)
      }
    }
  }

  if (isChildrenMap(props.children)) {
    for (const key of Object.keys(props.children)) {
      const childMeta = componentConfig.children![key]!

      mutateHandlers(props.children[key]!, `${prefix}${getComponentName(childMeta.Component)}: `, childMeta.config)
    }
  }
}
