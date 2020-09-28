import fetch from 'node-fetch'
import { sleep } from 'sleap'
import type { TGetTaskOptions, TGetTasksResponse, TGetTaskSuccessResponse } from './types'

const RETRY_TIMEOUT = 500

export const getTask = async <T extends TGetTaskSuccessResponse>(options: TGetTaskOptions): Promise<T> => {
  const getTasksResponse = await fetch('https://www.notion.so/api/v3/getTasks', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      cookie: `token_v2=${options.token}`,
    },
    body: JSON.stringify({
      taskIds: [options.taskId],
    }),
  })

  if (!getTasksResponse.ok) {
    throw new Error(`getTasks: unexpected response "${getTasksResponse.statusText}"`)
  }

  const { results } = await getTasksResponse.json() as TGetTasksResponse

  if (results.length > 1) {
    throw new Error('Only one concurrent task is currently supported')
  }

  let result = results[0]

  while (result.state === 'in_progress') {
    await sleep(RETRY_TIMEOUT)

    result = await getTask(options)
  }

  if (result.state === 'failure') {
    throw new Error(`getTasks: ${result.error}`)
  }

  return result as unknown as T
}
