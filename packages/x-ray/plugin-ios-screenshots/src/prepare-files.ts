import path from 'path'
import { writeFile } from 'pifs'

export const prepareFiles = async (entryPointPath: string, targetFiles: string[]): Promise<void> => {
  let data = targetFiles.map((file, i) => `import { examples as examples${i}, name as name${i} } from '${file}'`).join('\n')

  data += '\n'
  data += `export default [${targetFiles.map((file, i) => `{ path: '${file}', examples: examples${i}, name: name${i} }`)}]`

  const outfilePath = path.join(path.dirname(entryPointPath), 'files.js')

  await writeFile(outfilePath, data)
}
