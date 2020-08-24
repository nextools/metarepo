export const objectPick = <T extends {}, K extends keyof T>(obj: T, keys: readonly K[]): { [k in K]: T[k] } => {
  const res = {} as { [k in K]: T[k] }

  for (const k of keys) {
    res[k] = obj[k]
  }

  return res
}
