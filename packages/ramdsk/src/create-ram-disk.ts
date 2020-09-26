import process from 'process'
import { spawnChildProcess } from 'spown'
import { deleteRamDisk } from './delete-ram-disk'

export const createRamDisk = async (name: string, size: number): Promise<string> => {
  switch (process.platform) {
    case 'darwin': {
      const { stdout: diskPath } = await spawnChildProcess(`hdiutil attach -nomount ram://${size / 512}`)

      try {
        await spawnChildProcess(
          `diskutil erasevolume HFS+ "${name}" ${diskPath}`,
          // `diskutil partitionDisk ${diskPath} 1 GPTFormat APFS "${name}" "100%"`,
          { stdout: null }
        )
      } catch (e) {
        await deleteRamDisk(diskPath)

        throw e
      }

      return `/Volumes/${name}`
    }

    case 'linux': {
      const diskPath = `/mnt/${name}`

      try {
        await spawnChildProcess(
          `sudo mkdir "${diskPath}"`,
          { stdout: null }
        )
        await spawnChildProcess(
          `sudo mount --types tmpfs --options rw,size=${size} tmpfs "${diskPath}"`,
          { stdout: null }
        )
      } catch (e) {
        await deleteRamDisk(diskPath)

        throw e
      }

      return diskPath
    }

    default: {
      throw new Error(`Platform "${process.platform}" is not supported`)
    }
  }
}
