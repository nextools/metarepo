import BigInt, { BigInteger } from 'big-integer'
import jssha from 'jssha'
import { map } from 'iterama'
import { getPropsImpl } from './get-props'
import { getNextPermImpl } from './get-next-perm'
import { TComponentConfig } from './types'
import { serializeProps } from './serialize-props'
import { isChildrenMap } from './is-children-map'
import { createChildren } from './create-children'
import { getLength } from './get-length'

export const getPropsIterable = <T extends {}>(componentConfig: TComponentConfig<T>): Iterable<{ id: string, props: T }> => {
  const length = getLength(componentConfig)
  let int: BigInteger | null = BigInt.zero

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
          id: sha.getHash('B64'),
          props: props as T,
          progress: int.plus(BigInt.one).multiply(10000).divide(length).toJSNumber() / 100, // eslint-disable-line
        }

        int = getNextPermImpl(componentConfig, int)
      }
    },
  }
}

export const mapPropsIterable = <T, R>(componentConfig: TComponentConfig<T>, xf: (value: { id: string, props: T }) => R): Iterable<R> => {
  return map(xf)(getPropsIterable(componentConfig))
}
