import fetch from 'node-fetch'
import type { TEnqueueTaskOptions, TEnqueueTaskSuccessResponse } from './types'

export const enqueueTask = async (options: TEnqueueTaskOptions): Promise<string> => {
  const enqueueTaskResponse = await fetch('https://www.notion.so/api/v3/enqueueTask', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: `token_v2=${options.token}`,
    },
    body: JSON.stringify({
      task: {
        eventName: options.eventName,
        request: options.request,
      },
    }),
  })

  if (!enqueueTaskResponse.ok) {
    throw new Error(`enqueueTask: unexpected response "${enqueueTaskResponse.statusText}"`)
  }

  const result = await enqueueTaskResponse.json() as TEnqueueTaskSuccessResponse

  return result.taskId
}
