import { BigInteger } from 'big-integer'
import { ALPHABET } from './alphabet'

export const stringifyBigInt = (int: BigInteger) => {
  return int.toString(ALPHABET.length, ALPHABET)
}
