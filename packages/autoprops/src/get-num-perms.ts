import BigInt, { BigInteger } from 'big-integer'
import { TMetaFile } from './types'
import { getNextPermImpl } from './get-next-perm'

export const getNumPerms = (metaFile: TMetaFile): number => {
  let numPerms = 0
  let index: BigInteger | null = BigInt.zero

  while (index !== null) {
    ++numPerms
    index = getNextPermImpl(index, metaFile)
  }

  return numPerms
}
