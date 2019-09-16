/* eslint-disable no-throw-literal */
import path from 'path'
import pAll from 'p-all'
import { TarFs, TTarDataWithMeta } from '@x-ray/tar-fs'
import serialize from '@x-ray/serialize-react-tree'
import { TCheckRequest, TOptions } from '@x-ray/common-utils'
import { map } from 'iterama'
import { processSend } from '@x-ray/worker-utils'
import { TLineElement } from 'syntx'
import { checkSnapshot } from './check-snapshot'
import { TMeta, TSnapshotsItemResult } from './types'

const shouldBailout = Boolean(process.env.XRAY_CI)
const CONCURRENCY = 4

export default async (options: TOptions) => {
  try {
    const { platform } = options
    const filenames: string[] = []

    await new Promise((resolve, reject) => {
      process.on('message', async (action: TCheckRequest) => {
        try {
          switch (action.type) {
            case 'FILE': {
              const { default: items } = await import(action.path) as { default: Iterable<TMeta> }
              const snapshotsDir = path.join(path.dirname(action.path), '__tar__')
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
                        await processSend<TSnapshotsItemResult>({
                          type: 'BAILOUT',
                          id: item.id,
                          path: action.path,
                        })

                        process.disconnect()
                        process.exit(1)

                        throw null
                      }
                    }
                  }

                  switch (message.type) {
                    case 'DIFF':
                    case 'NEW': {
                      await processSend<TSnapshotsItemResult>({
                        ...message,
                        id: item.id,
                        serializedElement: item.serializedElement,
                      })

                      break
                    }
                    case 'OK': {
                      await processSend<TSnapshotsItemResult>({
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

                  await processSend<TSnapshotsItemResult>({
                    type: 'DELETED',
                    id: filename,
                    serializedElement: meta as TLineElement[][],
                    data,
                  })
                }
              }

              await tar.close()

              await processSend<TSnapshotsItemResult>({
                type: 'DONE',
                path: action.path,
              })

              break
            }
            case 'DONE': {
              resolve()
            }
          }
        } catch (err) {
          reject(err)
        }
      })

      processSend<TSnapshotsItemResult>({
        type: 'INIT',
      })
    })
  } catch (err) {
    console.error(err)

    if (err !== null) {
      await processSend<TSnapshotsItemResult>({
        type: 'ERROR',
        data: err.message,
      })
    }

    process.disconnect()
    process.exit(1)
  }

  process.disconnect()
  process.exit(0)
}
