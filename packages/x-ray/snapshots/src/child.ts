/* eslint-disable no-throw-literal */
import path from 'path'
import { parentPort, MessagePort } from 'worker_threads'
import pAll from 'p-all'
import { TarFs, TTarDataWithMeta } from '@x-ray/tar-fs'
import serialize from '@x-ray/serialize-react-tree'
import { TCheckRequest, TOptions } from '@x-ray/common-utils'
import { map } from 'iterama'
import { checkSnapshot } from './check-snapshot'
import { TMeta, TSnapshotsItemResult } from './types'

const shouldBailout = Boolean(process.env.XRAY_CI)
const port = parentPort as any as MessagePort
const CONCURRENCY = 4

export default async (options: TOptions) => {
  try {
    const { platform } = options
    const filenames: string[] = []

    await new Promise((resolve, reject) => {
      port.on('message', async (action: TCheckRequest) => {
        try {
          switch (action.type) {
            case 'FILE': {
              const { default: items } = await import(action.path) as { default: Iterable<TMeta> }
              const snapshotsDir = path.join(path.dirname(action.path), '__x-ray__')
              const tar = await TarFs(path.join(snapshotsDir, `${platform}-snapshots.tar`))

              await pAll(
                map((item: TMeta) => async () => {
                  const snapshot = await serialize(item.element)
                  const message = await checkSnapshot(Buffer.from(snapshot), tar, item.id)

                  filenames.push(item.id)

                  if (shouldBailout) {
                    switch (message.type) {
                      case 'DIFF':
                      case 'NEW': {
                        port.postMessage({
                          type: 'BAILOUT',
                          id: item.id,
                        } as TSnapshotsItemResult)

                        port.close()

                        throw null
                      }
                    }
                  }

                  switch (message.type) {
                    case 'DIFF':
                    case 'NEW': {
                      port.postMessage({
                        ...message,
                        id: item.id,
                        serializedElement: item.serializedElement,
                      } as TSnapshotsItemResult)

                      break
                    }
                    case 'OK': {
                      port.postMessage({
                        type: 'OK',
                        id: item.id,
                      })

                      break
                    }
                  }
                })(items),
                { concurrency: CONCURRENCY }
              )

              for (const filename of tar.list()) {
                if (!filenames.includes(filename)) {
                  const { data, meta } = await tar.read(filename) as TTarDataWithMeta

                  port.postMessage({
                    type: 'DELETED',
                    id: filename,
                    serializedElement: meta,
                    data,
                  } as TSnapshotsItemResult)
                }
              }

              port.postMessage({
                type: 'DONE',
                path: action.path,
              } as TSnapshotsItemResult)

              break
            }
            case 'DONE': {
              port.close()
              resolve()
            }
          }
        } catch (err) {
          reject(err)
        }
      })
    })
  } catch (err) {
    console.error(err)

    if (err !== null) {
      port.postMessage({
        type: 'ERROR',
        data: err.message,
      } as TSnapshotsItemResult)
    }
  }
}
