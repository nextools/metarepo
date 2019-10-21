import { useRef, useState, FC } from 'react'
import { shallowEqualByKeys, mapWithPropsMemo, startWithType } from 'refun'
import { EMPTY_OBJECT, isUndefined, TAnyObject } from 'tsfn'
import { createChildren, isChildrenMap, getProps, TComponentConfig } from 'autoprops'
import { pipe } from '@psxcode/compose'
import { TMetaFile, TComponents } from '../../types'

const cache = new Map<string, Promise<TMetaFile>>()

const importMeta = (components: TComponents, key: string): Promise<TMetaFile> => {
  if (cache.has(key)) {
    return cache.get(key)!
  }

  const promise = components[key]()

  cache.set(key, promise)

  return promise
}

const mapWithAsyncProps = <P extends {}, R extends {}> (mapper: (props: P) => Promise<R>, watchPropKeys: (keyof P)[]) =>
  (props: P): P & R => {
    const [result, setResult] = useState<R>()
    const prevProps = useRef<P>(EMPTY_OBJECT)

    if (prevProps.current === EMPTY_OBJECT || !shallowEqualByKeys(prevProps.current, props, watchPropKeys)) {
      setResult({} as R)
      mapper(props).then(setResult)
    }

    prevProps.current = props

    return {
      ...props,
      ...result,
    }
  }

export type TMapImportedComponent = {
  components: TComponents,
  componentKey: string | null,
  selectedSetIndex: string,
}

export type TMapImportedComponentResult = {
  Component?: FC<any>,
  componentConfig?: TComponentConfig,
  componentProps?: Readonly<TAnyObject>,
  componentPropsChildrenMap?: Readonly<TAnyObject>,
}

export const mapImportedComponent = <P extends TMapImportedComponent>() =>
  pipe(
    startWithType<P & TMapImportedComponent>(),
    mapWithAsyncProps(async ({ components, componentKey }) => {
      if (componentKey === null) {
        return {}
      }

      const metaFile = await importMeta(components, componentKey)

      return {
        componentMetaFile: metaFile,
      }
    }, ['componentKey']),
    mapWithPropsMemo(({ componentMetaFile, selectedSetIndex }): TMapImportedComponentResult => {
      if (isUndefined(componentMetaFile)) {
        return {}
      }

      const { Component, config } = componentMetaFile
      const props = getProps(config, selectedSetIndex)

      if (isChildrenMap(props.children)) {
        return {
          Component,
          componentConfig: config,
          componentPropsChildrenMap: props,
          componentProps: {
            ...props,
            children: createChildren(config, props.children),
          },
        }
      }

      return {
        Component,
        componentConfig: config,
        componentPropsChildrenMap: props,
        componentProps: props,
      }
    }, ['componentMetaFile', 'selectedSetIndex'])
  )
