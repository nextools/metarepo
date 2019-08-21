import BigInt, { BigInteger } from 'big-integer'
import { isDefined } from 'tsfn'
import jssha from 'jssha'
import { map } from 'iterama'
import { getPropsImpl } from './get-props'
import { getNextPermImpl } from './get-next-perm'
import { TMetaFile } from './types'
import { SerializeProps } from './serialize-props'
import { isChildrenMap } from './is-children-map'
import { createChildren } from './create-children'

export const getPropsIterable = <T>(metaFile: TMetaFile<T>) => ({
  int: BigInt.zero as BigInteger | null,
  *[Symbol.iterator]() {
    const serialize = SerializeProps()

    while (this.int !== null) {
      const props = getPropsImpl(this.int, metaFile)
      const sha = new jssha('SHA-1', 'TEXT')

      sha.update(serialize(props))

      if (isDefined(metaFile.childrenConfig) && isChildrenMap(props.children)) {
        props.children = createChildren(metaFile.childrenConfig, props.children)
      }

      yield {
        id: sha.getHash('B64'),
        props: props as T,
      }

      this.int = getNextPermImpl(this.int, metaFile)
    }
  },
})

export const mapPropsIterable = <T, R>(metaFile: TMetaFile<T>, xf: (value: { id: string, props: T }) => R): Iterable<R> => {
  return map(xf)(getPropsIterable(metaFile))
}
