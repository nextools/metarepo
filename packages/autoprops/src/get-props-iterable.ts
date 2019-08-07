import BigInt, { BigInteger } from 'big-integer'
import { getPropsImpl } from './get-props'
import { getNextPermImpl } from './get-next-perm'
import { TMetaFile } from './types'

export const getPropsIterable = (metaFile: TMetaFile) => ({
  int: BigInt.zero as BigInteger | null,
  *[Symbol.iterator]() {
    while (this.int !== null) {
      yield getPropsImpl(this.int, metaFile)

      this.int = getNextPermImpl(this.int, metaFile)
    }
  },
})
