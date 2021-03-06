import { pipeAsync } from 'funcom'
import { mapAsync } from 'iterama'

type TFileWithData = {
  path: string,
  data: string,
}

const find = async (globs: string[]): Promise<AsyncIterable<string>> => {
  const { matchGlobs } = await import('iva')

  return matchGlobs(globs)
}

const read = async (filePath: string): Promise<TFileWithData> => {
  const { readFile } = await import('fs/promises')
  const { sleep } = await import('sleap')

  await sleep(500)

  return {
    path: filePath,
    data: await readFile(filePath, 'utf8'),
  }
}

const write = async (fileWithData: TFileWithData): Promise<TFileWithData> => {
  const { sleep } = await import('sleap')

  await sleep(500)

  return fileWithData
}

export const build = async () => {
  const pathIterable = await find(['packages/re*/*.md'])
  const { piAllAsync } = await import('piall')
  const mapper = (filePath: string) => (): Promise<TFileWithData> => {
    return pipeAsync(
      read,
      write
    )(filePath)
  }
  const meta = mapAsync(mapper)(pathIterable)
  const pit = piAllAsync(meta, 2)

  for await (const m of pit) {
    // console.log(m.path)
    console.log('tick')
  }
}
