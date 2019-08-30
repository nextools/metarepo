export type TCharOrDelimiter = string | null

export type TMask = TCharOrDelimiter[]

export const getPositionInMasked = (value: string, mask: TMask, position: number, result = 0): number => {
  if (mask.length === 0) {
    return result
  }

  const [maskHead, ...maskTail] = mask

  if (position === 0) {
    if (maskHead === null || maskHead === value[0]) {
      return result
    }

    return getPositionInMasked(
      value,
      maskTail,
      position,
      result + 1
    )
  }

  if (maskHead === null || maskHead === value[0]) {
    return getPositionInMasked(
      value.slice(1),
      maskTail,
      position - 1,
      result + 1
    )
  }

  return getPositionInMasked(
    value,
    maskTail,
    position,
    result + 1
  )
}

export const getPositionInValue = (value: string, mask: TMask, position: number, result = position): number => {
  if (mask.length === 0 || position === 0) {
    return result
  }

  const [maskHead, ...maskTail] = mask

  if (maskHead === null || maskHead === value[0]) {
    return getPositionInValue(
      value.slice(1),
      maskTail,
      position - 1,
      result
    )
  }

  return getPositionInValue(
    value,
    maskTail,
    position - 1,
    result - 1
  )
}

export const applyMask = (value: string, mask: TMask, result: string = ''): string => {
  if (value.length === 0 || mask.length === 0) {
    return result
  }

  const [maskHead, ...maskTail] = mask

  if (maskHead === null || maskHead === value[0]) {
    return applyMask(
      value.slice(1),
      maskTail,
      result + value[0]
    )
  }

  return applyMask(
    value,
    maskTail,
    result + maskHead
  )
}

export const isLongerThanMask = (value: string, mask: TMask): boolean => {
  if (mask.length === 0) {
    if (value.length > 0) {
      return true
    }

    return false
  }

  if (value.length === 0) {
    return false
  }

  const [maskHead, ...maskTail] = mask

  if (maskHead === null || maskHead === value[0]) {
    return isLongerThanMask(
      value.slice(1),
      maskTail
    )
  }

  return isLongerThanMask(
    value,
    maskTail
  )
}
