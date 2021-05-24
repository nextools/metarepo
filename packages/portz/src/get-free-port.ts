import { isPortFree } from 'portu'

export const getFreePort = async (from: number, to: number, skipPorts: number[]): Promise<number> => {
  const _from = Math.max(1, from)
  const _to = Math.min(65535, to)

  for (let port = _from; port <= _to; port++) {
    if (skipPorts.includes(port)) {
      continue
    }

    const isFree = await isPortFree(port, '0.0.0.0')

    if (isFree) {
      return port
    }
  }

  throw new Error(`Unable to find free port within ${from}-${to} range`)
}
