import plugin from '@start/plugin'

const HOST = '0.0.0.0'
const PORT = 3001

export default plugin<{}, void>('syncState', ({ logMessage }) => async () => {
  const { default: WebSocket } = await import('ws')

  await new Promise<void>((resolve, reject) => {
    const wss = new WebSocket.Server({
      host: HOST,
      port: PORT,
    })
    const clientIds = new WeakMap()
    let currentState: any = null

    wss.on('connection', (ws) => {
      ws.on('message', (data: string) => {
        const { type, payload } = JSON.parse(data)

        switch (type) {
          case 'HANDSHAKE': {
            wss.clients.forEach((client) => {
              if (clientIds.get(client) === payload) {
                logMessage(`terminating "${payload}"`)
                client.terminate()
                clientIds.delete(client)
              }
            })

            clientIds.set(ws, payload)

            logMessage(`connected "${payload}" client (total: ${wss.clients.size})`)

            ws.send(
              JSON.stringify({
                type: 'SYNC',
                payload: currentState,
              })
            )

            return
          }

          case 'SYNC': {
            currentState = payload

            wss.clients.forEach((client) => {
              if (client !== ws) {
                // const platformId = clientIds.get(client)

                // logMessage(`sending synced state to "${platformId}"`)

                client.send(
                  JSON.stringify({
                    type: 'SYNC',
                    payload,
                  })
                )
              }
            })
          }
        }
      })

      ws.on('error', () => {})
    })

    wss.on('listening', () => {
      logMessage(`WebSocket server: ws://${HOST}:${PORT}`)
      resolve()
    })

    wss.on('error', (error) => {
      reject(error)
    })
  })
})
