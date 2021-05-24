import { tmpdir } from 'os'
import path from 'path'
import { realpath } from 'pifs'

let socketPath: null | string = null

export const getSocketPath = async () => {
  if (socketPath !== null) {
    return socketPath
  }

  const tmpDir = await realpath(tmpdir())

  socketPath = path.join(tmpDir, 'portz.sock')

  return socketPath
}
