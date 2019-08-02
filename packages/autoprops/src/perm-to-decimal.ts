import { PermutationDecimal } from './types'

export const permToDecimal = (values: bigint[], length: bigint[]): PermutationDecimal => {
  let result: PermutationDecimal = 0n
  let multipliedLength = 1n

  for (let i = 0; i < values.length; ++i) {
    if (i > 0) {
      multipliedLength *= length[i - 1]
    }

    result += values[i] * multipliedLength
  }

  return result
}
