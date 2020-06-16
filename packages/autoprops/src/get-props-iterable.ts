import BigInt from 'big-integer'
import jssha from 'jssha'
import { map } from 'iterama'
import { getPropsImpl } from './get-props'
import { TComponentConfig } from './types'
import { serializeProps } from './serialize-props'
import { isChildrenMap } from './is-children-map'
import { createChildren } from './create-children'
import { getLength } from './get-length'
import { getValidPermImpl } from './get-valid-perm'

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
