import path from 'path'
import type { StartPlugin } from '@start/plugin'
import Reporter from '@start/reporter-verbose'
import { getStartOptions } from '../utils'

const TASK_NAME_REGEXP = /^[a-z]/

type TTasks = {
  [k: string]: (...args: any[]) => StartPlugin<any, any>,
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
;(async () => {
  try {
    const options = await getStartOptions()
    const tasksFile = typeof options.file === 'string' ? path.resolve(options.file) : require.resolve('..')
    const tasks = await import(tasksFile) as TTasks
    const filteredTasks = Object.entries(tasks).reduce((acc, [key, value]) => {
      if (TASK_NAME_REGEXP.test(key)) {
        acc[key] = value
      }

      return acc
    }, {} as TTasks)
    const taskName = process.argv[2]
    const task = filteredTasks[taskName]

    if (typeof taskName === 'undefined' || typeof task === 'undefined') {
      console.error('One of the following task names is required:')
      console.error(`* ${Object.keys(filteredTasks).join('\n* ')}`)
      process.exit(1)
    }

    const reporter = Reporter(taskName)
    const taskArgs = process.argv.slice(3)
    const taskRunner = await task(...taskArgs)

    await taskRunner(reporter)()
  } catch (error) {
    if (error !== null) {
      console.error(error)
    }

    process.exit(1)
  }
})()
