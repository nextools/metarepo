import { TBumpType } from './types'

const types: TBumpType[] = ['patch', 'minor', 'major']

export const compareReleaseTypes = (a: TBumpType | null, b: TBumpType | null) => {
  if (a === b) {
    return 0
  }

  if (a === null) {
    return -1
  }

  if (b === null) {
    return 1
  }

  const ia = types.indexOf(a)
  const ib = types.indexOf(b)

  if (ia < 0) {
    throw new Error(`release type ${a} is not supported`)
  }

  if (ib < 0) {
    throw new Error(`release type ${b} is not supported`)
  }

  return ia - ib
}
