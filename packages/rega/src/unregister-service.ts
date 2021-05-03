import { once } from 'events'
import http from 'http'
import type { IncomingMessage } from 'http'
import { getSocketPath } from './get-socket-path'

export const unregisterService = async (name: string): Promise<void> => {
  const socketPath = await getSocketPath()

  const req = http.request({
    method: 'POST',
    path: '/unregister',
    socketPath,
  })

  req.write(name)
  req.end()

  const [res] = await once(req, 'response') as [IncomingMessage]

  if (res.statusCode !== 200) {
    throw new Error(res.statusMessage)
  }
}
