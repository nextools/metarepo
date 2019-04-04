const divideFiles = (files: string[], divideBy: number) => {
  const divided = files.length / divideBy
  const fileParts: string[][] = []
  let filesIndex = 0

  for (let i = 0; i < divideBy; ++i) {
    const part = i % 2 > 0 ? Math.ceil(divided) : Math.floor(divided)

    fileParts.push(files.slice(filesIndex, part + filesIndex))
    filesIndex += part
  }

  return fileParts
}

export default divideFiles
