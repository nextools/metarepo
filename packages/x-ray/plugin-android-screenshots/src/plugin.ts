import http from 'http'
import { runAndroidApp } from '@rebox/android'
import { getTarFilePath } from '@x-ray/core'
import type { TTotalResults, TPlugin, TExampleResults } from '@x-ray/core'
import { access } from 'pifs'
import { rsolve } from 'rsolve'
import { TarMap } from 'tarmap'
import type { TTarMap } from 'tarmap'
import type { TJsonValue } from 'typeon'
import { unchunkJson } from 'unchunk'
import { ApplyDpr } from './apply-dpr'
import { bufferToPng } from './buffer-to-png'
import { SERVER_PORT, SERVER_HOST } from './constants'
import { hasScreenshotDiff } from './has-screenshot-diff'
import { prepareMeta } from './prepare-meta'

type TRequest = {
  path: string,
  name: string,
  id: string,
  base64data: string,
  meta: TJsonValue,
  isDone: boolean,
}

export type TAndroidScreenshotsOptions = {
  dependencyNames?: string[],
  fontsDir?: string,
  shouldBailout?: boolean,
}

export const androidScreenshots = (options?: TAndroidScreenshotsOptions): TPlugin<Uint8Array> => ({
  name: 'android-screenshots',
  encoding: 'image',
  appEntryPointPath: require.resolve('./App'),
  getResults: async (files) => {
    const opts = {
      shouldBailout: false,
      dependencyNames: [],
      ...options,
    }
    const entryPointPath = await rsolve('@x-ray/native-screenshots-app', 'react-native')

    await prepareMeta(entryPointPath, files)

    const closeAndroidApp = await runAndroidApp({
      appName: 'X-Ray',
      appId: 'org.nextools.xray',
      entryPointPath,
      fontsDir: opts?.fontsDir,
      dependencyNames: [
        'react-native-svg',
        'react-native-view-shot',
        ...opts.dependencyNames,
      ],
      portsToForward: [3002],
      isHeadless: true,
    })

    const applyDpr = ApplyDpr(3)
    const totalResults: TTotalResults<Uint8Array> = new Map()
    let results: TExampleResults<Buffer> = new Map()
    let status = {
      ok: 0,
      new: 0,
      diff: 0,
      deleted: 0,
    }
    let tarMap = null as null | TTarMap
    let currentPath: string

    try {
      await new Promise<void>((serverResolve, serverReject) => {
        const server = http.createServer(async (req, res) => {
          try {
            if (req.url === '/upload') {
              const { path, name, id, meta, isDone, base64data } = await unchunkJson<TRequest>(req)

              if (currentPath !== path) {
                try {
                  const tarFilePath = getTarFilePath({
                    examplesFilePath: path,
                    examplesName: name,
                    pluginName: 'android-screenshots',
                  })

                  await access(tarFilePath)

                  tarMap = await TarMap(tarFilePath)
                } catch {
                  tarMap = null
                }

                currentPath = path
              }

              const newScreenshot = Buffer.from(base64data, 'base64')

              // NEW
              if (tarMap === null || !tarMap.has(id)) {
                if (opts.shouldBailout) {
                  throw new Error(`BAILOUT: ${path} → ${id} → NEW`)
                }

                const png = bufferToPng(newScreenshot)

                results.set(id, {
                  type: 'NEW',
                  meta,
                  data: newScreenshot,
                  width: applyDpr(png.width),
                  height: applyDpr(png.height),
                })

                status.new++
              } else {
                const origScreenshot = await tarMap.read(id) as Buffer

                const origPng = bufferToPng(origScreenshot)
                const newPng = bufferToPng(newScreenshot)

                // DIFF
                if (hasScreenshotDiff(origPng, newPng)) {
                  if (opts.shouldBailout) {
                    throw new Error(`BAILOUT: ${path} → ${id} → DIFF`)
                  }

                  results.set(id, {
                    type: 'DIFF',
                    meta,
                    data: newScreenshot,
                    width: applyDpr(newPng.width),
                    height: applyDpr(newPng.height),
                    origData: origScreenshot,
                    origWidth: applyDpr(origPng.width),
                    origHeight: applyDpr(origPng.height),
                  })

                  status.diff++
                  // OK
                } else {
                  results.set(id, { type: 'OK' })

                  status.ok++
                }
              }

              if (isDone) {
                // DELETED
                if (tarMap !== null) {
                  for (const id of tarMap.list()) {
                    if (id.endsWith('-meta')) {
                      continue
                    }

                    if (!results.has(id)) {
                      if (opts.shouldBailout) {
                        throw new Error(`BAILOUT: ${path} → ${id} → DELETED`)
                      }

                      const deletedScreenshot = await tarMap.read(id) as Buffer
                      const deletedPng = bufferToPng(deletedScreenshot)
                      const metaId = `${id}-meta`
                      let meta

                      if (tarMap.has(metaId)) {
                        const metaBuffer = await tarMap.read(metaId) as Buffer

                        meta = JSON.parse(metaBuffer.toString('utf8')) as TJsonValue
                      }

                      results.set(id, {
                        type: 'DELETED',
                        meta,
                        data: deletedScreenshot,
                        width: applyDpr(deletedPng.width),
                        height: applyDpr(deletedPng.height),
                      })

                      status.deleted++
                    }
                  }

                  await tarMap.close()
                }

                totalResults.set(path, { name, results, status })

                status = {
                  ok: 0,
                  new: 0,
                  diff: 0,
                  deleted: 0,
                }

                results = new Map()

                console.log(name)
              }
            } else if (req.url === '/done') {
              server.close(() => {
                serverResolve()
              })
            }
          } catch (error) {
            serverReject(error)
          }

          res.end()
        })

        server.once('error', serverReject)
        server.listen(SERVER_PORT, SERVER_HOST)
      })
    } finally {
      await closeAndroidApp()
    }

    return totalResults
  },
})

