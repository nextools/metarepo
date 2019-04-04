import { cpus } from 'os'
import { divideFiles, logTotalResults } from '@x-ray/common-utils'
import parent from './parent'
import { TOptions } from './types'

const CONCURRENCY = Math.max(cpus().length - 1, 1)

const runFiles = async (targetFiles: string[], options: TOptions) => {
  const totalResults = await Promise.all(
    divideFiles(targetFiles, CONCURRENCY).map((files) => parent(files, options))
  )

  logTotalResults(totalResults)
}

export default runFiles
