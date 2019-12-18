import { TComponentConfig, isChildrenMap } from 'autoprops'
import { TAnyObject, isFunction } from 'tsfn'
import { isHandler, getComponentName } from '../../utils'
import { consoleLog } from '../../store-console'

// eslint-disable-next-line max-params
export const mutateHandlers = (props: Readonly<TAnyObject>, prefix: string, componentConfig: TComponentConfig) => {
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
      const childMeta = componentConfig.children![key]

      mutateHandlers(props.children[key]!, `${prefix}${getComponentName(childMeta.Component)}: `, childMeta.config)
    }
  }
}
