import BigInt, { BigInteger } from 'big-integer'

export const getKeysWithStateProps = (values: BigInteger[], propKeys: string[]): string[] => {
  const keysWithState: string[] = []

  for (let i = 0; i < propKeys.length; ++i) {
    if (values[i].greater(BigInt.zero)) {
      keysWithState.push(propKeys[i])
    }
  }

  for (let i = propKeys.length; i < values.length; ++i) {
    if (values[i].greater(BigInt.zero)) {
      keysWithState.push('children')

      break
    }
  }

  return keysWithState
}

export const getKeysWithStateChildren = (values: BigInteger[], childrenKeys: string[], propsIndexOffset: number): string[] => {
  const keysWithState: string[] = []

  for (let i = 0; i < childrenKeys.length; ++i) {
    if (values[i + propsIndexOffset].greater(BigInt.zero)) {
      keysWithState.push(childrenKeys[i])
    }
  }

  return keysWithState
}
