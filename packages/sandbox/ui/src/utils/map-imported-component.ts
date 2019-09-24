import { useRef, useState } from 'react'
import { shallowEqualByKeys, mapWithPropsMemo, startWithType } from 'refun'
import { EMPTY_OBJECT, isUndefined, TAnyObject } from 'tsfn'
import { TMetaFile, createChildren, isChildrenMap, getProps } from 'autoprops'
import { pipe } from '@psxcode/compose'
import { TComponents } from '../types'
import { importMeta } from './import-meta'

const mapWithAsyncProps = <P extends {}, R extends {}> (mapper: (props: P) => Promise<R>, watchPropKeys: (keyof P)[]) =>
  (props: P): P & Partial<R> => {
    const [result, setResult] = useState<R>()
    const prevProps = useRef<P>(EMPTY_OBJECT)

    if (!shallowEqualByKeys(prevProps.current, props, watchPropKeys)) {
      prevProps.current = props

      mapper(props).then(setResult)
    }

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

export type TMapImportedComponentOut = {
  componentMetaFile?: TMetaFile,
  componentProps?: TAnyObject,
  componentPropsChildrenMap?: TAnyObject,
}

export const mapImportedComponent = <P extends TMapImportedComponent>() =>
  pipe(
    startWithType<P>(),
    mapWithAsyncProps(async ({ components, componentKey }) => {
      if (componentKey === null) {
        return {}
      }

      const metaFile = await importMeta(components, componentKey)

      return {
        componentMetaFile: metaFile,
      }
    }, ['componentKey']),
    mapWithPropsMemo(({ componentMetaFile, selectedSetIndex, componentKey }) => {
      if (isUndefined(componentMetaFile)) {
        return {}
      }

      const props = getProps(selectedSetIndex, componentMetaFile)

      if (isChildrenMap(props.children)) {
        if (isUndefined(componentMetaFile.childrenConfig)) {
          throw new Error(`Cannot find childrenConfig in ${componentKey} meta file`)
        }

        const children = createChildren(componentMetaFile.childrenConfig, props.children)

        return {
          componentPropsChildrenMap: props,
          componentProps: {
            ...props,
            children,
          },
        }
      }

      return {
        componentPropsChildrenMap: props,
        componentProps: props,
      }
    }, ['componentMetaFile', 'selectedSetIndex'])
  )
