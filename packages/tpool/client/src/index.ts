import { randomBytes } from 'crypto'
import type { TJsonValue } from 'typeon'
// import type { TJsonValue } from 'typeon'
import { once } from 'wans'
import WS from 'ws'

export type TMessageDone<T> = {
  type: 'DONE',
  id: string,
  // TODO: TJsonValue
  value: T,
}

export type TMessageError = {
  type: 'ERROR',
  id: string,
  value: string,
}

export type TMessage<T> = TMessageDone<T> | TMessageError

export type TConnectToThreadPoolOptions = {
  socketPath: string,
}

export const connectToThreadPool = async (options: TConnectToThreadPoolOptions) => {
  const client = new WS(`ws+unix://${options.socketPath}`)

  await once(client, 'open')

  return <T>(message: TJsonValue): Promise<T> => {
    const id = randomBytes(16).toString('hex')

    client.send(JSON.stringify({
      id,
      message,
    }))

    return new Promise((resolve, reject) => {
      const onMessage = (data: string) => {
        const message = JSON.parse(data) as TMessage<T>

        if (message.id === id) {
          if (message.type === 'DONE') {
            resolve(message.value)
          } else if (message.type === 'ERROR') {
            reject(message.value)
          }

          client.removeListener('message', onMessage)
        }
      }

      client.on('message', onMessage)
    })
  }
}
