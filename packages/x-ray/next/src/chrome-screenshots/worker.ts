import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import puppeteer, { ElementHandle } from 'puppeteer-core'
import { access } from 'pifs'
import { TarFs, TTarFs } from '@x-ray/tar-fs'
import { TJsonValue } from 'typeon'
import { map, toMapAsync } from 'iterama'
import { piAll } from 'piall'
import { getTarFilePath } from '../utils/get-tar-file-path'
import { hasScreenshotDiff } from '../utils/has-screenshot-diff'
import { bufferToPng } from '../utils/buffer-to-png'
import { ApplyDpr } from '../utils/apply-dpr'
import { TExample, TExampleResult } from '../types'
import { TWorkerResultInternal, TCheckOptions } from './types'
import { SCREENSHOTS_PER_WORKER_COUNT } from './constants'
import { getContainerStyle } from './get-container-style'

const SELECTOR = '[data-x-ray]'

export const check = async ({ browserWSEndpoint, dpr }: TCheckOptions) => {
  const applyDpr = ApplyDpr(dpr)
  const browser = await puppeteer.connect({
    browserWSEndpoint,
    defaultViewport: {
      deviceScaleFactor: dpr,
      width: 1024,
      height: 1024,
    },
  })
  const pages = await Promise.all(
    Array.from({ length: SCREENSHOTS_PER_WORKER_COUNT }, () => browser.newPage())
  )

  // stop using internal pool and allocate memory every time
  // because we transfer underlying memory from worker, and hopefully
  // it's faster than copying a lot of buffers from worker to parent
  //
  // otherwise it leads to `Cannot perform Construct on a neutered ArrayBuffer` error
  Buffer.poolSize = 0

  return async (filePath: string): Promise<TWorkerResultInternal<Buffer>> => {
    const tarFilePath = getTarFilePath(filePath, 'chrome-screenshots')
    let tarFs = null as null | TTarFs

    try {
      await access(tarFilePath)

      tarFs = await TarFs(tarFilePath)
    } catch {}

    const { name, examples } = await import(filePath) as { examples: Iterable<TExample>, name: string }
    const transferList = [] as ArrayBuffer[]
    const status = {
      ok: 0,
      new: 0,
      diff: 0,
      deleted: 0,
    }

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
        if (tarFs === null || !tarFs.has(example.id)) {
          transferList.push(newScreenshot.buffer)

          const png = bufferToPng(newScreenshot)

          status.new++

          return [example.id, {
            type: 'NEW',
            meta: example.meta,
            data: newScreenshot,
            width: applyDpr(png.width),
            height: applyDpr(png.height),
          }]
        }

        const origScreenshot = await tarFs.read(example.id) as Buffer

        const origPng = bufferToPng(origScreenshot)
        const newPng = bufferToPng(newScreenshot)

        // DIFF
        if (hasScreenshotDiff(origPng, newPng)) {
          transferList.push(origScreenshot.buffer, newScreenshot.buffer)

          status.diff++

          return [example.id, {
            type: 'DIFF',
            origData: origScreenshot,
            origWidth: applyDpr(origPng.width),
            origHeight: applyDpr(origPng.height),
            newData: newScreenshot,
            newWidth: applyDpr(newPng.width),
            newHeight: applyDpr(newPng.height),
            meta: example.meta,
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
    if (tarFs !== null) {
      for (const id of tarFs.list()) {
        if (id.endsWith('-meta')) {
          continue
        }

        if (!fileResults.has(id)) {
          const deletedScreenshot = await tarFs.read(id) as Buffer
          const deletedPng = bufferToPng(deletedScreenshot)
          const metaId = `${id}-meta`
          let meta

          if (tarFs.has(metaId)) {
            const metaBuffer = await tarFs.read(id) as Buffer

            meta = JSON.parse(metaBuffer.toString('utf8')) as TJsonValue
          }

          transferList.push(deletedScreenshot)

          fileResults.set(id, {
            type: 'DELETED',
            data: deletedScreenshot,
            meta,
            width: applyDpr(deletedPng.width),
            height: applyDpr(deletedPng.height),
          })

          status.deleted++
        }
      }

      await tarFs.close()
    }

    return {
      value: [filePath, { name, results: fileResults, status }],
      transferList,
    }
  }
}
