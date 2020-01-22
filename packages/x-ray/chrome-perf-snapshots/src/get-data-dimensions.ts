import { TFileResultLine } from './types'

export const getDataDimensions = (lines: TFileResultLine[]) => {
  let maxWidth = 0

  for (const line of lines) {
    if (line.value.length > maxWidth) {
      maxWidth = line.value.length
    }
  }

  return {
    width: maxWidth,
    height: lines.length,
  }
}
