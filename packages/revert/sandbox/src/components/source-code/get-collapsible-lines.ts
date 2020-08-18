import type { TLine } from 'syntx'

export const getCollapsibleLineIndexes = (lines: readonly TLine[]): number[] => {
  const firstLineMeta = new Map<string, number>()
  const collapsibleMetas = new Set<string>()
  const result: number[] = []

  for (let i = 0; i < lines.length; i++) {
    const { meta } = lines[i]

    if (!firstLineMeta.has(meta)) {
      firstLineMeta.set(meta, i)

      continue
    }

    if (!collapsibleMetas.has(meta)) {
      collapsibleMetas.add(meta)
      result.push(firstLineMeta.get(meta)!)
    }
  }

  return result
}
