import path from 'path'
import Reporter from '@start/reporter-verbose'
import { StartPlugin } from '@start/plugin'
import { getStartOptions } from '../utils'

(async () => {
  try {
    const options = await getStartOptions()
    const tasksFile = options && options.file ? path.resolve(options.file) : require.resolve('..')
    const tasks = await import(tasksFile)
    const taskName = process.argv[2]
    const task = tasks[taskName] as (...args: any[]) => StartPlugin<any, any>

    if (typeof taskName === 'undefined' || typeof task === 'undefined') {
      console.error('One of the following task names is required:')
      console.error(`* ${Object.keys(tasks).join('\n* ')}`)
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
