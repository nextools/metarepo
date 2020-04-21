import BigInt, { BigInteger } from 'big-integer'
import { TCommonComponentConfig } from './types'
import { getNextPermImpl } from './get-next-perm'

export const getNumPerms = (componentConfig: TCommonComponentConfig): number => {
  let numPerms = 0
  let index: BigInteger | null = BigInt.zero

  while (index !== null) {
    ++numPerms
    index = getNextPermImpl(componentConfig, index)
  }

  return numPerms
}
