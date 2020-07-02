import { getTarFilePath, TExample, TExampleResult } from '@x-ray/core'
import { map, toMapAsync } from 'iterama'
import { piAll } from 'piall'
import { access } from 'pifs'
import puppeteer, { ElementHandle } from 'puppeteer-core'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { TarMap, TTarMap } from 'tarmap'
import { TJsonValue } from 'typeon'
import { ApplyDpr } from './apply-dpr'
import { bufferToPng } from './buffer-to-png'
import { SCREENSHOTS_PER_WORKER_COUNT } from './constants'
import { getContainerStyle } from './get-container-style'
import { hasScreenshotDiff } from './has-screenshot-diff'
import { TWorkerResultInternal, TCheckOptions } from './types'

const SELECTOR = '[data-x-ray]'

export const check = async (options: TCheckOptions) => {
  const applyDpr = ApplyDpr(options.dpr)
  const browser = await puppeteer.connect({
    browserWSEndpoint: options.browserWSEndpoint,
    defaultViewport: {
      deviceScaleFactor: options.dpr,
      width: 1024,
      height: 1024,
    },
  })
  const pages = await Promise.all(
    Array.from({ length: SCREENSHOTS_PER_WORKER_COUNT }, () => browser.newPage())
  )
  let tarMap = null as null | TTarMap

  // stop using internal pool and allocate memory every time
  // because we transfer underlying memory from worker, and hopefully
  // it's faster than copying a lot of buffers from worker to parent
  //
  // otherwise it leads to `Cannot perform Construct on a neutered ArrayBuffer` error
  Buffer.poolSize = 0

  return async (item: IteratorResult<string>): Promise<TWorkerResultInternal<Buffer> | void> => {
    if (tarMap !== null) {
      await tarMap.close()
    }

    if (item.done) {
      return
    }

    const { name, examples } = await import(item.value) as { examples: Iterable<TExample>, name: string }
    const transferList = new Set<ArrayBuffer>()
    const status = {
      ok: 0,
      new: 0,
      diff: 0,
      deleted: 0,
    }

    const tarFilePath = getTarFilePath({
      examplesFilePath: item.value,
      examplesName: name,
      pluginName: 'chromium-screenshots',
    })

    try {
      await access(tarFilePath)

      tarMap = await TarMap(tarFilePath)
    } catch {}

    try {
      const asyncIterable = piAll(
        map((example: TExample) => async (): Promise<[string, TExampleResult<Buffer>]> => {
          const html = renderToStaticMarkup(
            createElement(
              'div',
              {
                'data-x-ray': true,
                style: getContainerStyle(example.options),
              },
              example.element
            )
          )
          const page = pages.shift()!

          await page.setContent(html)

          const domElement = await page.$(SELECTOR) as ElementHandle
          const newScreenshot = await domElement.screenshot({ encoding: 'binary' })

          page.removeAllListeners()
          pages.push(page)

          // NEW
          if (tarMap === null || !tarMap.has(example.id)) {
            if (options.shouldBailout) {
              throw new Error(`BAILOUT: ${item.value} → ${example.id} → NEW`)
            }

            transferList.add(newScreenshot.buffer)

            const png = bufferToPng(newScreenshot)

            status.new++

            return [example.id, {
              type: 'NEW',
              meta: example.meta?.(example.element),
              data: newScreenshot,
              width: applyDpr(png.width),
              height: applyDpr(png.height),
            }]
          }

          const origScreenshot = await tarMap.read(example.id) as Buffer

          const origPng = bufferToPng(origScreenshot)
          const newPng = bufferToPng(newScreenshot)

          // DIFF
          if (hasScreenshotDiff(origPng, newPng)) {
            if (options.shouldBailout) {
              throw new Error(`BAILOUT: ${item.value} → ${example.id} → DIFF`)
            }

            transferList.add(origScreenshot.buffer)
            transferList.add(newScreenshot.buffer)

            status.diff++

            return [example.id, {
              type: 'DIFF',
              meta: example.meta?.(example.element),
              data: newScreenshot,
              width: applyDpr(newPng.width),
              height: applyDpr(newPng.height),
              origData: origScreenshot,
              origWidth: applyDpr(origPng.width),
              origHeight: applyDpr(origPng.height),
            }]
          }

          // OK
          status.ok++

          return [example.id, {
            type: 'OK',
          }]
        })(examples),
        SCREENSHOTS_PER_WORKER_COUNT
      )

      const fileResults = await toMapAsync(asyncIterable)

      // DELETED
      if (tarMap !== null) {
        for (const id of tarMap.list()) {
          if (id.endsWith('-meta')) {
            continue
          }

          if (!fileResults.has(id)) {
            if (options.shouldBailout) {
              throw new Error(`BAILOUT: ${item.value} → ${id} → DELETED`)
            }

            const deletedScreenshot = await tarMap.read(id) as Buffer
            const deletedPng = bufferToPng(deletedScreenshot)
            const metaId = `${id}-meta`
            let meta

            if (tarMap.has(metaId)) {
              const metaBuffer = await tarMap.read(metaId) as Buffer

              meta = JSON.parse(metaBuffer.toString('utf8')) as TJsonValue
            }

            transferList.add(deletedScreenshot.buffer)

            fileResults.set(id, {
              type: 'DELETED',
              meta,
              data: deletedScreenshot,
              width: applyDpr(deletedPng.width),
              height: applyDpr(deletedPng.height),
            })

            status.deleted++
          }
        }
      }

      return {
        value: [item.value, { name, results: fileResults, status }],
        transferList: Array.from(transferList),
      }
    } finally {
      if (tarMap !== null) {
        await tarMap.close()
      }
    }
  }
}
