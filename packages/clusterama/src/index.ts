import path from 'path'
import cluster from 'cluster'
import { cpus } from 'os'
import getCallerFile from 'get-caller-file'

export type TClusteramaOptions = {
  threadCount: number,
  serverFilePath: string,
}

export const clusterama = (options: TClusteramaOptions) => {
  const callerDir = path.dirname(getCallerFile())
  const fullServerFilePath = require.resolve(path.resolve(callerDir, options.serverFilePath))

  return new Promise((resolve) => {
    let onlineWorkerCount = 0

    if (cluster.isMaster) {
      cluster.setupMaster({
        exec: fullServerFilePath,
      })

      for (let i = 0; i < options.threadCount; i++) {
        cluster.fork()
      }

      cluster.on('online', () => {
        onlineWorkerCount++

        if (onlineWorkerCount === options.threadCount) {
          resolve()
        }
      })

      cluster.on('exit', () => {
        cluster.fork()
      })
    }
  })
}

export const main = async () => {
  await clusterama({
    threadCount: cpus().length,
    serverFilePath: './child.js',
  })

  console.log('ready')
}
