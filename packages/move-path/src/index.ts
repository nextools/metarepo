import path from 'path'

const movePath = (from: string, to: string): string => {
  const fromRelative = path.relative(process.cwd(), from)
  const toRelative = path.relative(process.cwd(), to)

  // same
  if (fromRelative === toRelative) {
    return path.resolve(toRelative)
  }

  const inSplit = fromRelative.split(path.sep)
  const outSplit = toRelative.split(path.sep)
  const index = inSplit.findIndex((segment, i) => segment !== outSplit[i])

  // nested
  if (fromRelative.indexOf(toRelative) === 0) {
    return path.resolve(
      toRelative,
      ...inSplit.slice(index)
    )
  }

  if (inSplit.length === index + 1) {
    return path.resolve(toRelative, ...inSplit.slice(index))
  }

  // skip same segments
  return path.resolve(toRelative, ...inSplit.slice(index + 1))
}

export default movePath
