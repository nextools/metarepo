import { Children, isValidElement, useRef } from 'react'
import type { ReactElement, ReactNode } from 'react'
import { isSymbol, getObjectKeys, getObjectValues, UNDEFINED, EMPTY_OBJECT, NOOP } from 'tsfn'
import type { TExtend } from 'tsfn'
import { SYMBOL_CHILDREN_REST } from './symbols'

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

export const mapChildren = <K extends string> (childrenMap: TChildrenMap<K>) => {
  const allChildrenSymbols: symbol[] = []

  if (process.env.NODE_ENV === 'development') {
    for (const { symbols } of getObjectValues(childrenMap)) {
      allChildrenSymbols.push(...symbols)
    }
  }

  const childrenMapKeys = getObjectKeys(childrenMap)
  const childrenMapRestKey = childrenMapKeys.find((key) => childrenMap[key].symbols[0] === SYMBOL_CHILDREN_REST)

  const createChildrenProps = (): TChildrenProps<K> =>
    childrenMapKeys.reduce((res, key) => {
      res[key] = []

      return res
    }, {} as any)

  const clearChildrenProps = (childrenProps: TChildrenProps<K>) => {
    for (const key of childrenMapKeys) {
      childrenProps[key] = []
    }
  }

  const createChildMapFn = (childrenProps: TChildrenProps<K>) => {
    const childMapFn = (child?: {} | null) => {
      if (!isValidElement(child)) {
        if (process.env.NODE_ENV === 'development' && child !== null) {
          console.error(`Text elements ("${child}") are not allowed as a child`)
        }

        return
      }

      if (isReactFragment(child) || isReactContext(child)) {
        Children.forEach(child.props.children, childMapFn)

        return
      }

      const childSymbol = getElementSymbol(child)

      if (childSymbol === null) {
        if (process.env.NODE_ENV === 'development') {
          console.log(child)
          console.error(`Dom or Native elements are not allowed as a child`)
        }

        return
      }

      // Try to consume child as childrenMap entry
      for (const key of childrenMapKeys) {
        const { symbols, isMultiple } = childrenMap[key]

        if (symbols.includes(childSymbol)) {
        // Report multiple items not allowed
          if (process.env.NODE_ENV === 'development') {
            if (childrenProps[key].length > 0 && isMultiple !== true) {
              console.error(`Element "${childSymbol.description}" is only allowed once as a child`)
            }
          }

          childrenProps[key].push(child)

          return
        }
      }

      // Try to consume child as rest
      if (childrenMapRestKey !== UNDEFINED) {
      // Report multiple items not allowed
        if (process.env.NODE_ENV === 'development') {
          if (childrenProps[childrenMapRestKey].length > 0 && childrenMap[childrenMapRestKey].isMultiple !== true) {
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
    }

    return childMapFn
  }

  return <P extends { children?: ReactNode }> (props: P): TExtend<P, { [key in K]: ReactElement[] }> => {
    const childrenPropsRef = useRef<TChildrenProps<K>>(EMPTY_OBJECT)
    const mapChildrenFnRef = useRef(NOOP)

    if (childrenPropsRef.current === EMPTY_OBJECT) {
      childrenPropsRef.current = createChildrenProps()

      mapChildrenFnRef.current = createChildMapFn(childrenPropsRef.current)
    }

    clearChildrenProps(childrenPropsRef.current)

    Children.forEach(props.children, mapChildrenFnRef.current)

    return {
      ...props,
      ...childrenPropsRef.current,
    }
  }
}
