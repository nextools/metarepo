import path from 'path'
import { pipeline } from 'stream'
import { promisify } from 'util'
import fetch from 'node-fetch'
import unzipStream from 'unzipper'
import { enqueueTask } from './enqueue-task'
import { getTask } from './get-task'
import { normalizeBlockId } from './normalize-block-id'
import type { TDownloadMarkdownOptions, TTaskExportBlockResponse } from './types'

const pPipeline = promisify(pipeline)

export const downloadMarkdown = async (options: TDownloadMarkdownOptions): Promise<string> => {
  const blockId = normalizeBlockId(options.blockId)
  const taskId = await enqueueTask({
    token: options.token,
    eventName: 'exportBlock',
    request: {
      blockId,
      recursive: false,
      exportOptions: {
        exportType: 'markdown',
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locale: 'en',
      },
    },
  })
  const taskResult = await getTask<TTaskExportBlockResponse>({
    token: options.token,
    taskId,
  })

  const exportUrl = taskResult.status.exportURL
  const exportUrlResponse = await fetch(exportUrl)

  if (!exportUrlResponse.ok) {
    throw new Error(`exportUrl: unexpected response "${exportUrlResponse.statusText}"`)
  }

  const outputPath = path.resolve(options.outputDirPath)

  await pPipeline(
    exportUrlResponse.body,
    unzipStream.Extract({
      path: outputPath,
    })
  )

  return outputPath
}
