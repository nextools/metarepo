import BigInt from 'big-integer'
import { map } from 'iterama'
import jssha from 'jssha'
import { createChildren } from './create-children'
import { getLength } from './get-length'
import { getPropsImpl } from './get-props'
import { getValidPermImpl } from './get-valid-perm'
import { isChildrenMap } from './is-children-map'
import { serializeProps } from './serialize-props'
import type { TComponentConfig } from './types'

export const getPropsIterable = <T extends {}>(componentConfig: TComponentConfig<T, string>): Iterable<{ id: string, props: T }> => {
  const length = getLength(componentConfig)
  let int = getValidPermImpl(componentConfig, BigInt.zero)

  return {
    *[Symbol.iterator]() {
      while (int !== null) {
        const props = getPropsImpl(componentConfig, int)

        if (isChildrenMap(props.children)) {
          props.children = createChildren(componentConfig, props.children)
        }

        const sha = new jssha('SHA-1', 'TEXT')

        sha.update(serializeProps(componentConfig, int))

        yield {
          id: sha.getHash('HEX'),
          props: props as T,
          progress: int.plus(BigInt.one).multiply(10000).divide(length).toJSNumber() / 100, // eslint-disable-line
        }

        int = getValidPermImpl(componentConfig, int.plus(BigInt.one))
      }
    },
  }
}

export const mapPropsIterable = <T, R>(componentConfig: TComponentConfig<T, string>, xf: (value: { id: string, props: T }) => R): Iterable<R> => {
  return map(xf)(getPropsIterable(componentConfig))
}
