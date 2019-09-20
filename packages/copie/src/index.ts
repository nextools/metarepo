import { createReadStream, createWriteStream, lstat, chmod, chown, utimes } from 'pifs'

// TODO: extract me
const toUnixTimestamp = (date: Date): number => Math.trunc(date.getTime() / 1000)

const copie = async (fromPath: string, toPath: string): Promise<void> => {
  await new Promise<void>((resolve, reject) => {
    const readStream = createReadStream(fromPath)
    const writeStream = createWriteStream(toPath)

    readStream.on('error', reject)
    writeStream.on('error', reject)
    writeStream.on('finish', resolve)

    readStream.pipe(writeStream)
  })

  const stats = await lstat(fromPath)

  await Promise.all([
    chown(toPath, stats.uid, stats.gid),
    chmod(toPath, stats.mode),
    utimes(toPath, toUnixTimestamp(stats.atime), toUnixTimestamp(stats.mtime)),
  ])
}

export default copie
