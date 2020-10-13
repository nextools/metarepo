import { createServer } from 'net'

export const checkPort = (port: number, host: string): Promise<boolean> =>
  new Promise((resolve, reject) => {
    const server = createServer()

    server
      .unref()
      .on('error', (err: any) => {
        if (err.code === 'EADDRINUSE') {
          resolve(false)
        } else {
          reject(err)
        }
      })
      .on('listening', () => {
        server.close((err) => {
          if (typeof err !== 'undefined') {
            reject(err)
          } else {
            resolve(true)
          }
        })
      })
      .listen(port, host)
  })
