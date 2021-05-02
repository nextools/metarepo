import { once } from 'events'
import http from 'http'
import dleet from 'dleet'
import { unchunkJson } from 'unchunk'
import { getSocketPath } from './get-socket-path'
import { register, cleanup } from './register'
import type { TRegisterOptions } from './types'

export const startServer = async (): Promise<() => Promise<void>> => {
  const socketPath = await getSocketPath()

  const server = http.createServer(async (req, res) => {
    try {
      const options = await unchunkJson<TRegisterOptions>(req)
      const result = await register(options)

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(result))
    } catch (err) {
      res.writeHead(500, err.message)
      res.end()
    }
  })

  await dleet(socketPath)
  server.listen(socketPath)
  await once(server, 'listening')

  return async () => {
    cleanup()
    server.close()
    await once(server, 'close')
    await dleet(socketPath)
  }
}
