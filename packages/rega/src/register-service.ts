import { once } from 'events'
import http from 'http'
import type { IncomingMessage } from 'http'
import { unchunkJson } from 'unchunk'
import { getSocketPath } from './get-socket-path'
import type { TRegisterServiceOptions } from './types'

type TRegisterService = {
  <T extends string>(options: TRegisterServiceOptions & { depNames: T[] }): Promise<{ port: number, deps: { [k in T]: number } }>,
  (options: TRegisterServiceOptions): Promise<{ port: number }>,
}

export const registerService: TRegisterService = async (options: any) => {
  const socketPath = await getSocketPath()
  const data = JSON.stringify(options)

  const req = http.request({
    method: 'POST',
    path: '/register',
    socketPath,
    headers: {
      'Content-Type': 'application/json',
    },
  })

  req.write(data)
  req.end()

  const [res] = await once(req, 'response') as [IncomingMessage]

  if (res.statusCode !== 200) {
    throw new Error(res.statusMessage)
  }

  const result = await unchunkJson<any>(res)

  return result
}
