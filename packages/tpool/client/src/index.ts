import { once } from 'wans'
import WS from 'ws'

export type TConnectToThreadPoolOptions = {
  socketPath: string,
}

export const connectToThreadPool = async (options: TConnectToThreadPoolOptions) => {
  const client = new WS(`ws+unix://${options.socketPath}`)
  let i = 0

  await once(client, 'open')

  return async (message: string) => {
    const id = i++

    client.send(JSON.stringify({
      id,
      message,
    }))

    await new Promise<void>((resolve) => {
      const onMessage = (message: string) => {
        if (Number(message) === id) {
          resolve()

          client.removeListener('message', onMessage)
        }
      }

      client.on('message', onMessage)
    })
  }
}
