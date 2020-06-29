import path from 'path'
import { writeFile } from 'pifs'

export const prepareMeta = async (entryPointPath: string, targetFiles: string[]): Promise<void> => {
  let data = targetFiles.map((file, i) => `import { examples as examples${i}, name as name${i} } from '${file}'`).join('\n')

  data += '\n'
  data += `export const files = [${targetFiles.map((file, i) => `{ path: '${file}', examples: examples${i}, name: name${i} }`)}]`

  const outfilePath = path.join(path.dirname(entryPointPath), 'meta.js')

  await writeFile(outfilePath, data)
}
