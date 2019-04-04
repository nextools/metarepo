export const arrayUnique = <T> (arr: T[]): boolean => {
  for (let i = 0; i < arr.length; ++i) {
    for (let k = i + 1; k < arr.length; ++k) {
      if (arr[k] === arr[i]) {
        return false
      }
    }
  }

  return true
}
