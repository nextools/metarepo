import plugin from '@start/plugin'

const sleep = (timeout: number) => new Promise((resolve) => setTimeout(resolve, timeout))

export default plugin('wait-for-firefox', () => async () => {
  const { Socket } = await import('net')

  const waitForFirefox = () => (
    new Promise((resolve) => {
      const socket = new Socket()
      let isAvailablePort = false

      socket
        .setTimeout(200)
        .once('connect', () => {
          socket.once('data', () => {
            isAvailablePort = true

            socket.destroy()
          })
        })
        .once('timeout', () => {
          socket.destroy()
        })
        .once('error', () => {
          resolve(false)
        })
        .once('close', () => {
          if (isAvailablePort) {
            resolve(true)
          } else {
            resolve(false)
          }
        })
        .connect(2828, 'localhost')
    })
  )

  while (!(await waitForFirefox())) {
    await sleep(200)
  }
})
