import type { FC, ReactElement } from 'react'

export const getComponentName = (component: FC<any>) => {
  return component.displayName || component.name
}

export const getElementName = (element: ReactElement<any>) => {
  if (typeof element.type === 'string') {
    return element.type
  }

  return (element.type as FC<any>).displayName || element.type.name
}
