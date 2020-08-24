import { Children, isValidElement } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { isSymbol, getObjectKeys, getObjectValues, isDefined } from 'tsfn'
import type { TExtend, TOmitKey } from 'tsfn'

export const SYMBOL_CHILDREN_REST = Symbol('CHILDREN_REST')

export type TChildrenMap<K extends string> = {
  [key in K]: {
    symbols: symbol[],
    isMultiple?: boolean,
    isRequired?: boolean,
  }
}

type TChildrenProps<K extends string> = {
  [key in K]: ReactElement<any>[]
}

export const getElementSymbol = (element: ReactElement<any>): symbol | null => {
  if (isSymbol((element.type as any).componentSymbol)) {
    return (element.type as any).componentSymbol
  }

  return null
}

const isReactFragment = (value: any): value is ReactElement => value.type === Symbol.for('react.fragment')
const isReactContext = (value: any): value is ReactElement => value.type === Symbol.for('react.context')

const flattenChildren = (children: ReactNode) => {
  const result: ReactNode[] = []

  Children.forEach(children, (child) => {
    if (isValidElement(child) && (isReactFragment(child) || isReactContext(child))) {
      result.push(...child.props.children)
    } else {
      result.push(child)
    }
  })

  return result
}

export const mapChildren = <K extends string> (childrenMap: TChildrenMap<K>) =>
  <P extends { children?: ReactNode }> (props: P): TExtend<TOmitKey<P, 'children'>, { [key in K]: ReactElement[] }> => {
    const allChildrenSymbols: symbol[] = []

    if (process.env.NODE_ENV === 'development') {
      for (const { symbols } of getObjectValues(childrenMap)) {
        allChildrenSymbols.push(...symbols)
      }
    }

    const childrenMapKeys = getObjectKeys(childrenMap)
    const childrenProps: TChildrenProps<K> = childrenMapKeys.reduce((res, key) => {
      res[key] = []

      return res
    }, {} as any)
    const flatChildren = flattenChildren(props.children)
    const childrenMapRestKey = childrenMapKeys.find((key) => childrenMap[key].symbols[0] === SYMBOL_CHILDREN_REST)

    Children.forEach(flatChildren, (child) => {
      if (isValidElement(child)) {
        const childSymbol = getElementSymbol(child)

        if (childSymbol === null) {
          if (process.env.NODE_ENV === 'development') {
            console.log(child)
            console.error(`Dom or Native elements are not allowed as a child`)
          }

          return
        }

        // Try to consume child as childrenMap
        for (const key of childrenMapKeys) {
          const { symbols, isMultiple } = childrenMap[key]

          if (symbols.includes(childSymbol)) {
            if (process.env.NODE_ENV === 'development') {
              if (childrenProps[key].length > 0 && !isMultiple) {
                console.error(`Element "${childSymbol.description}" is only allowed once as a child`)
              }
            }

            childrenProps[key].push(child)

            return
          }
        }

        // Try to consume child as rest
        if (isDefined(childrenMapRestKey)) {
          const { isMultiple } = childrenMap[childrenMapRestKey]

          if (process.env.NODE_ENV === 'development') {
            if (childrenProps[childrenMapRestKey].length > 0 && !isMultiple) {
              console.error(`Element "${childrenMapRestKey}" is only allowed once as a child`)
            }
          }

          childrenProps[childrenMapRestKey].push(child)

          return
        }

        // Child is not allowed
        if (process.env.NODE_ENV === 'development') {
          if (!allChildrenSymbols.includes(childSymbol)) {
            console.error(`Element "${childSymbol.description}" is not allowed as a child`)
          }
        }
      } else if (process.env.NODE_ENV === 'development' && child !== null) {
        console.error(`Text elements ("${child}") are not allowed as a child`)
      }
    })

    return {
      ...props,
      ...childrenProps,
    }
  }
