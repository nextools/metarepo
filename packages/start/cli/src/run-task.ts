import { cleanupStack } from 'erru'
import { drainAsync } from 'iterama'
import { red } from 'kolorist'
import { startTimeMs } from 'takes'
import { isString } from 'tsfn'
import type { TTask } from '../../../../tasks/types'

export const runTask = async (task: TTask<any, any>, args: string[]): Promise<void> => {
  const endTimeMs = startTimeMs()

  try {
    await drainAsync(task(...args))
  } catch (err) {
    if (isString(err?.message)) {
      console.error(`${red('\nerror:')} ${err.message}`)

      if (isString(err.stack)) {
        console.error(`\n${red(cleanupStack(err.stack))}`)
      }
    } else if (err !== null) {
      console.error(err)
    }
  } finally {
    console.log(`⏱  time: ${endTimeMs()}ms`)
  }
}
