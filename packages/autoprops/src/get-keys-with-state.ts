import BigInt, { BigInteger } from 'big-integer'

export const getKeysWithState = (values: BigInteger[], propKeys: string[], valuesIndexOffset: number): string[] => {
  const keysWithState: string[] = []

  for (let i = 0; i < propKeys.length; ++i) {
    if (values[i + valuesIndexOffset].greater(BigInt.zero)) {
      keysWithState.push(propKeys[i])
    }
  }

  return keysWithState
}
