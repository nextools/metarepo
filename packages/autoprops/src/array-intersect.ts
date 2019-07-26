export const arrayIntersect = <T> (a: T[], aLenght: number, b: T[], bLength: number): number => {
  if (bLength < aLenght) {
    return arrayIntersect(b, bLength, a, aLenght)
  }

  let result = 0

  for (let i = 0; i < aLenght; ++i) {
    for (let j = 0; j < bLength; ++j) {
      if (a[i] === b[j]) {
        ++result

        break
      }
    }
  }

  return result
}
