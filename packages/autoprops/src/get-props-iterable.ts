import BigInt, { BigInteger } from 'big-integer'
import { isDefined } from 'tsfn'
import jssha from 'jssha'
import { map } from 'iterama'
import { getPropsImpl } from './get-props'
import { getNextPermImpl } from './get-next-perm'
import { TMetaFile } from './types'
import { serializeProps } from './serialize-props'
import { isChildrenMap } from './is-children-map'
import { createChildren } from './create-children'

export const getPropsIterable = <T>(metaFile: TMetaFile<T>): Iterable<{ id: string, props: T }> => {
  let int: BigInteger | null = BigInt.zero

  return {
    *[Symbol.iterator]() {
      while (int !== null) {
        const props = getPropsImpl(int, metaFile)
        const sha = new jssha('SHA-1', 'TEXT')

        sha.update(serializeProps(int, metaFile))

        if (isDefined(metaFile.childrenConfig) && isChildrenMap(props.children)) {
          props.children = createChildren(metaFile.childrenConfig, props.children)
        }

        yield {
          id: sha.getHash('B64'),
          props: props as T,
        }

        int = getNextPermImpl(int, metaFile)
      }
    },
  }
}

export const mapPropsIterable = <T, R>(metaFile: TMetaFile<T>, xf: (value: { id: string, props: T }) => R): Iterable<R> => {
  return map(xf)(getPropsIterable(metaFile))
}
