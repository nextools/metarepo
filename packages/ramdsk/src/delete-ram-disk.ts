import process from 'process'
import { spawnChildProcess } from 'spown'

export const deleteRamDisk = async (diskPath: string): Promise<void> => {
  switch (process.platform) {
    case 'darwin': {
      await spawnChildProcess(
        `hdiutil detach -force ${diskPath}`,
        { stdout: null }
      )

      break
    }

    case 'linux': {
      await spawnChildProcess(
        `sudo unmount --force ${diskPath}`,
        { stdout: null }
      )

      break
    }

    default: {
      throw new Error(`Platform "${process.platform}" is not supported`)
    }
  }
}
