import { isUndefined } from 'util'
import { TAnyObject, getObjectKeys } from 'tsfn'
import { TComponentConfig } from './types'

const isBoolean = (arg: string): boolean => {
  return arg.startsWith('is') || arg.startsWith('has') || arg.startsWith('should')
}

const isHandler = (arg: string): boolean => {
  return arg.startsWith('on')
}

const compareHandler = (handler: string, other: string): number => {
  if (isHandler(other)) {
    return handler.localeCompare(other)
  }

  return 1
}

const compareBoolean = (bool: string, other: string): number => {
  if (isHandler(other)) {
    return -1
  }

  if (isBoolean(other)) {
    return bool.localeCompare(other)
  }

  return 1
}

export const getPropKeys = (props: TAnyObject): string[] => {
  return Object.keys(props).sort((a, b) => {
    if (isBoolean(a)) {
      return compareBoolean(a, b)
    }

    if (isHandler(a)) {
      return compareHandler(a, b)
    }

    if (isBoolean(b)) {
      return compareBoolean(b, a) * -1
    }

    if (isHandler(b)) {
      return compareHandler(b, a) * -1
    }

    if (a === 'children') {
      return 1
    }

    if (b === 'children') {
      return -1
    }

    return a.localeCompare(b)
  })
}

export const getChildrenKeys = <ChildrenKeys extends string>(componentConfig: TComponentConfig<any, ChildrenKeys>): ChildrenKeys[] => {
  if (isUndefined(componentConfig.children)) {
    return []
  }

  return getObjectKeys(componentConfig.children)
}
