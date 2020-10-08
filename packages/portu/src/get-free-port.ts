import { checkPort } from './check-port'

export const getFreePort = async (from: number, to: number, host: string): Promise<number> => {
  const _from = Math.max(1, from)
  const _to = Math.min(65535, to)

  for (let port = _from; port <= _to; port++) {
    const isFree = await checkPort(port, host)

    if (isFree) {
      return port
    }
  }

  throw new Error(`Unable to find free port within ${from}-${to} range`)
}
