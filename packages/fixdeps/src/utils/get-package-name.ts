const relativePattern = /^(\.\/|\.\.\/)/
const scopePattern = /^(?:(@[^/]+)[/]+)([^/]+)[/]?/
const basePattern = /^([^/]+)[/]?/

export const getPackageName = (str: string): string | null => {
  //relative path
  if (relativePattern.test(str)) {
    return null
  }

  // scoped package
  let match = scopePattern.exec(str)

  if (match && match[1] && match[2]) {
    return `${match[1]}/${match[2]}`
  }

  // normal package
  match = basePattern.exec(str)

  if (match) {
    return match[1]
  }

  return null
}
