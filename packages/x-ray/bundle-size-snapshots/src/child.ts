/* eslint-disable no-throw-literal */
import path from 'path'
import { TarFs, TTarDataWithMeta } from '@x-ray/tar-fs'
import { TCheckRequest, TSyntxLines } from '@x-ray/common-utils'
import { processSend } from '@x-ray/worker-utils'
import { getBundleSize } from 'siza'
import { checkSnapshot } from './check-snapshot'
import { TSnapshotsItemResult } from './types'

const shouldBailout = Boolean(process.env.XRAY_CI)

export default async () => {
  try {
    const filenames: string[] = []

    await new Promise((resolve, reject) => {
      process.on('message', async (action: TCheckRequest) => {
        try {
          switch (action.type) {
            case 'FILE': {
              const snapshotsDir = path.join(path.dirname(action.path), '__data__')
              const tar = await TarFs(path.join(snapshotsDir, 'bundle-size-snapshots.tar.gz'))
              const bundleSize = await getBundleSize({
                entryPointPath: action.path,
              })

              const snapshot = JSON.stringify(bundleSize, null, 2)
              const id = 'id'
              const message = await checkSnapshot(Buffer.from(snapshot), tar, id)

              filenames.push(id)

              if (shouldBailout) {
                switch (message.type) {
                  case 'DIFF':
                  case 'NEW': {
                    await processSend<TSnapshotsItemResult>({
                      type: 'BAILOUT',
                      reason: message.type,
                      id,
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
                    id,
                    serializedElement: [],
                  })

                  break
                }
                case 'OK': {
                  await processSend<TSnapshotsItemResult>({
                    type: 'OK',
                    id,
                  })

                  break
                }
              }

              for (const filename of tar.list()) {
                if (!filenames.includes(filename)) {
                  const { data, meta } = await tar.read(filename) as TTarDataWithMeta

                  await processSend<TSnapshotsItemResult>({
                    type: 'DELETED',
                    id: filename,
                    serializedElement: meta as TSyntxLines,
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
