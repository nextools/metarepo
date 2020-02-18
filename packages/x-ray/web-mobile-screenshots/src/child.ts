import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { processSend } from '@x-ray/worker-utils'
import { TMeta, getContainerStyle } from '@x-ray/screenshot-utils'
import { TWorkerHtmlResult, TWorkerDone, TChildOptions, TWorkerError } from './types'

export default ({ targetFiles }: TChildOptions) => {
  let fileIndex: number = 0
  let iterator: Iterator<TMeta> | null = null

  const onMessage = async (type: string): Promise<void> => {
    if (type === 'next') {
      try {
        if (iterator === null) {
          if (fileIndex >= targetFiles.length) {
            await processSend<TWorkerDone>({
              type: 'DONE',
            })

            process.disconnect()
            process.exit(0)

            return
          }

          const { default: screenshots } = await import(targetFiles[fileIndex]) as { default: Iterable<TMeta> }

          iterator = screenshots[Symbol.iterator]()
        }

        const screenshot = iterator.next()

        if (screenshot.done) {
          fileIndex++
          iterator = null

          return onMessage(type)
        }

        const html = renderToStaticMarkup(
          createElement(
            'div',
            {
              'data-x-ray': true,
              style: getContainerStyle(screenshot.value.options),
            },
            screenshot.value.element
          )
        )

        await processSend<TWorkerHtmlResult>({
          type: 'NEXT',
          id: screenshot.value.id,
          serializedElement: screenshot.value.serializedElement,
          path: targetFiles[fileIndex],
          html,
        })
      } catch (err) {
        console.error(err)

        if (err !== null) {
          await processSend<TWorkerError>({
            type: 'ERROR',
            data: err.message,
          })
        }

        process.disconnect()
        process.exit(1)
      }
    }
  }

  process.on('message', onMessage)
}
