import { readFile, writeFile } from 'pifs'
import { isDefined, isString, isArray } from 'tsfn'
import { parse } from './parse'
import type { TResult } from './types'

export type TUpdateMarkdownOptions = {
  inputFilePaths: string[],
  outputFilePath: string,
}

export const updateMarkdown = async (options: TUpdateMarkdownOptions): Promise<void> => {
  let md = ''
  const totalResults: TResult[] = []

  for (const inputFilePath of options.inputFilePaths) {
    const results = await parse(inputFilePath)

    totalResults.push(...results)
  }

  // sort so that type-alias results comes first
  totalResults.sort((a, b) => {
    if (a.type === 'type-alias' && b.type !== 'type-alias') {
      return -1
    }

    return 1
  })

  for (const result of totalResults) {
    if (isDefined(result.doc)) {
      if (isString(result.doc.description)) {
        md += `\n\n${result.doc.description}`
      }

      if (isArray(result.doc.tags)) {
        for (const tag of result.doc.tags) {
          if (tag.tag === 'param') {
            md += `* \`${tag.name}\` – ${tag.description}\n`
          }

          if (tag.tag === 'returns') {
            md += `\nReturns ${tag.description}.\n`
          }
        }

        md += '\n'
      }
    }

    md += '\n\n```ts\n'
    md += result.source
    md += '\n```'
  }

  let markdownContent = await readFile(options.outputFilePath, 'utf8')

  markdownContent = markdownContent.replace(/\n\n## API\n.+?(\n\n##|\n$)/s, `\n\n## API${md}$1`)

  await writeFile(options.outputFilePath, markdownContent)
}
