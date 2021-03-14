import { randomBytes } from 'crypto'
import { once } from 'wans'
import WS from 'ws'

export type TConnectToThreadPoolOptions = {
  socketPath: string,
}

export const connectToThreadPool = async (options: TConnectToThreadPoolOptions) => {
  const client = new WS(`ws+unix://${options.socketPath}`)

  await once(client, 'open')

  return async (message: string) => {
    const id = randomBytes(16).toString('hex')

    client.send(JSON.stringify({
      id,
      message,
    }))

    await new Promise<void>((resolve) => {
      const onMessage = (message: string) => {
        if (message === id) {
          resolve()

          client.removeListener('message', onMessage)
        }
      }

      client.on('message', onMessage)
    })
  }
}
