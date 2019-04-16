export const arrayIntersect = <T> (a: T[], b: T[]): T[] => {
  const [smallArr, largeArr] = a.length < b.length ? [a, b] : [b, a]

  return smallArr.reduce((res, av) => {
    if (largeArr.includes(av)) {
      res.push(av)
    }

    return res
  },
  [] as T[])
}
