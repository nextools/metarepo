import { logTotalResults } from '@x-ray/common-utils'
import parent from './parent'
import { TOptions } from './types'

const defaultOptions: Partial<TOptions> = {
  width: 1024,
  height: 1024,
}

const runFiles = async (targetFiles: string[], userOptions: TOptions) => {
  const options = {
    ...defaultOptions,
    ...userOptions,
  }
  const totalResults = await parent(targetFiles, options)

  logTotalResults([totalResults])
}

export default runFiles
