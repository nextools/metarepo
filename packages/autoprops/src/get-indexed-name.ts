const getNameSuffix = (names: string[], nameIndex: number) => {
  const name = names[nameIndex]
  let suffix = -1

  for (let i = 0; i <= nameIndex; ++i) {
    if (names[i] === name) {
      ++suffix
    }
  }

  return suffix
}

export const getBaseName = (name: string): string => {
  return name.split('__')[0]
}

export const getIndexedName = (names: string[], nameIndex: number): string =>
  `${names[nameIndex]}__${getNameSuffix(names, nameIndex)}`

export const getIndexedNameIndex = (names: string[], indexedName: string): number => {
  const [name, indexStr] = indexedName.split('__')
  const index = parseInt(indexStr, 10)

  for (let i = 0, s = 0; i < names.length; ++i) {
    if (names[i] === name && s++ === index) {
      return i
    }
  }

  throw new Error(`Could not find name "${indexedName}" index in "[${names}]"`)
}

export const makeIndexedNames = (names: string[]): string[] => {
  const result: string[] = []

  for (let i = 0; i < names.length; ++i) {
    result.push(getIndexedName(names, i))
  }

  return result
}
