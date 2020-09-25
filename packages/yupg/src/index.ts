import path from 'path'
import { rewriteStream } from 'rwrw'
import { spawnChildProcess } from 'spown'
import { lineStream } from 'stroki'
import { skipLinesStream } from './skip-lines-stream'

export const upgradeDependency = async (depName: string) => {
  const yarnLockFilePath = path.resolve('yarn.lock')
  const { readableStream, writableStream } = await rewriteStream(yarnLockFilePath)

  await new Promise((resolve, reject) => {
    writableStream
      .on('finish', resolve)
      .on('error', reject)

    readableStream
      .on('error', reject)
      .pipe(lineStream())
      .on('error', reject)
      .pipe(skipLinesStream(depName))
      .on('error', reject)
      .pipe(writableStream)
  })

  await spawnChildProcess('yarn install --non-interactive', { stderr: process.stderr })
}
