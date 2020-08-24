import type { TLine } from 'syntx'

export const collapseLines = (lines: readonly TLine[], collapsedMetas: readonly string[]): (TLine | null)[] => {
  const resultLines: (TLine | null)[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // non-collapsible lines
    if (!collapsedMetas.includes(line.meta)) {
      resultLines.push(line)
      i++

      continue
    }

    // first collapsed line
    const lineMeta = line.meta

    resultLines.push(line)
    i++

    let nextSameMetaIndex = 0
    let endOfImmediateLinesIndex = 0
    let k = i

    // skip immediate lines
    while (k < lines.length && lineMeta === lines[k].meta) {
      k++
    }

    endOfImmediateLinesIndex = k

    // find next same meta index
    while (k < lines.length) {
      if (lineMeta === lines[k].meta) {
        nextSameMetaIndex = k

        break
      }

      k++
    }

    if (nextSameMetaIndex > 0) {
      // skip prop lines
      while (i < endOfImmediateLinesIndex) {
        resultLines.push(lines[i])
        i++
      }

      // collapse children lines
      while (i <= nextSameMetaIndex) {
        resultLines.push(null)
        i++
      }
    } else {
      // collapse children lines
      while (i < endOfImmediateLinesIndex) {
        resultLines.push(null)
        i++
      }
    }
  }

  return resultLines
}
