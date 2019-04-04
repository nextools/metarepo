import path from 'path'
import { promisify } from 'util'
import { writeFile } from 'graceful-fs'

const pWriteFile = promisify(writeFile)

const prepareFiles = async (targetFiles: string[]) => {
  const outfile = `export default [${targetFiles.map((file) => `() => ({ path: '${file}', content: import('${file}')})`).join(', ')}]`

  await pWriteFile(path.join(__dirname, 'files.js'), outfile, { encoding: 'utf8' })
}

export default prepareFiles
