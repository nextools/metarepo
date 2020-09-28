import fetch from 'node-fetch'
import { sleep } from 'sleap'

const TIMEOUT = 200

const tryToGetDebuggerUrl = async (port: number): Promise<string | null> => {
  try {
    const response = await fetch(`http://localhost:${port}/json/version`, { timeout: TIMEOUT })
    const { webSocketDebuggerUrl } = await response.json()

    return webSocketDebuggerUrl
  } catch {
    return null
  }
}

export const getDebuggerUrl = async (port: number): Promise<string> => {
  let debuggerUrl = await tryToGetDebuggerUrl(port)

  while (debuggerUrl === null) {
    await sleep(TIMEOUT)

    debuggerUrl = await getDebuggerUrl(port)
  }

  return debuggerUrl
}
