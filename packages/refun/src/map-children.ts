import { Children, ReactElement, ReactNode, isValidElement } from 'react'
import { TExtend, isUndefined } from 'tsfn'
import { isFragment } from 'react-is'
import { getElementName } from './utils'
import { TComponentMeta } from './types'

export type TChildrenMap = {
  [key: string]: {
    names: string[],
    isMultiple?: boolean,
    isRequired?: boolean,
    dependsOn?: string[],
  },
}

const flattenChildren = (children: ReactNode) => {
  const result: ReactNode[] = []

  Children.forEach(children, (child) => {
    if (isFragment(child)) {
      result.push(...child.props.children)
    } else {
      result.push(child)
    }
  })

  return result
}

export const mapChildren = <C extends TChildrenMap> (propsToNames: C) =>
  <P extends { children?: ReactNode }> ({ children, ...props }: P, meta: TComponentMeta) => {
    let propsToNamesValues: string[] = []

    if (process.env.NODE_ENV === 'development') {
      propsToNamesValues = Object.values(propsToNames).reduce((result, value) => {
        return result.concat(value.names)
      }, [] as string[])
    }

    const childrenProps = Object.keys(propsToNames).reduce((result, key) => {
      const componentNames = propsToNames[key].names
      const flatChildren = flattenChildren(children)

      Children.forEach(flatChildren, (child) => {
        if (isValidElement(child)) {
          const displayName = getElementName(child)

          if (componentNames.includes(displayName)) {
            if (Array.isArray(result[key])) {
              if (propsToNames[key].isMultiple === true) {
                result[key].push(child)
              } else if (process.env.NODE_ENV === 'development') {
                console.error(`Element "${displayName}" is only allowed once as a child of "${meta.displayName}"`)
              }
            } else {
              result[key] = [child]
            }
          }

          if (process.env.NODE_ENV === 'development') {
            if (!propsToNamesValues.includes(displayName)) {
              console.error(`Element "${displayName}" is not allowed as a child of "${meta.displayName}"`)
            }
          }
        } else if (process.env.NODE_ENV === 'development' && child !== null) {
          console.error(`Text elements ("${child}") are not allowed as a child of "${meta.displayName}"`)
        }
      })

      return result
    }, {} as { [K in keyof C]: ReactElement<any>[] })

    if (process.env.NODE_ENV === 'development') {
      Object.entries(propsToNames).forEach(([key, { names, isRequired, dependsOn }]) => {
        if (isRequired === true && isUndefined(childrenProps[key])) {
          console.error(`Elements "${names.join(', ')}" are required as a children of "${meta.displayName}"`)
        }

        if (!isUndefined(childrenProps[key]) && Array.isArray(dependsOn)) {
          dependsOn.forEach((dep) => {
            if (isUndefined(childrenProps[dep])) {
              console.error(`Elements "${names.join(', ')}" depends on "${propsToNames[dep].names.join(', ')}"`)
            }
          })
        }
      })
    }

    return {
      ...props,
      ...childrenProps,
    } as TExtend<P, typeof childrenProps>
  }
