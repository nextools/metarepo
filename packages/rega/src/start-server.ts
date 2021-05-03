import { once } from 'events'
import http from 'http'
import dleet from 'dleet'
import { unchunkJson, unchunkString } from 'unchunk'
import { getFreePort } from './get-free-port'
import { getSocketPath } from './get-socket-path'
import type { TDeps, TExecutors, TRegisterServiceOptions, TRegisterServiceResult } from './types'

export const startServer = async (): Promise<() => Promise<void>> => {
  const registry = new Map<string, number>()
  const depsQueue = new Map<string, TExecutors>()
  const concurrencyQueue = new Map<string, Promise<number>>()

  const server = http.createServer(async (req, res) => {
    const { pathname } = new URL(req.url!, 'http://localhost')

    try {
      switch (pathname) {
        case '/register': {
          const { name, deps: depNames, fromPort, toPort } = await unchunkJson<TRegisterServiceOptions>(req)

          if (registry.has(name)) {
            throw new Error(`Service "${name}" is already registered`)
          }

          const deps: TDeps = {}

          // wait for dependencies
          if (Array.isArray(depNames)) {
            for (const depName of depNames) {
              if (registry.has(depName)) {
                deps[depName] = registry.get(depName)!
              } else {
                if (!depsQueue.has(depName)) {
                  depsQueue.set(depName, new Set())
                }

                const depPort = await new Promise<number>((resolve, reject) => {
                  depsQueue.get(depName)!.add([resolve, reject])
                })

                deps[depName] = depPort
              }
            }
          }

          let port: number
          let hasError = false
          let error: any

          try {
            // wait for the rest of already registering services to finish
            if (concurrencyQueue.size > 0) {
              await Promise.all(concurrencyQueue.values())
            }

            const skipPorts = Array.from(registry.values())
            const portPromise = getFreePort(fromPort, toPort, skipPorts)

            concurrencyQueue.set(name, portPromise)

            port = await portPromise

            concurrencyQueue.delete(name)

            // register
            registry.set(name, port)
          } catch (err) {
            hasError = true
            error = err

            throw err
          } finally {
            // resolve or reject dependents
            if (depsQueue.has(name)) {
              const executors = depsQueue.get(name)!

              for (const [resolver, rejecter] of executors) {
                if (hasError) {
                  rejecter(error)
                } else {
                  resolver(port!)
                }
              }

              executors.clear()
              depsQueue.delete(name)
            }
          }

          const result: TRegisterServiceResult = { port }

          if (Array.isArray(depNames)) {
            result.deps = deps
          }

          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify(result))

          break
        }

        case '/unregister': {
          const name = await unchunkString(req)

          if (!registry.has(name)) {
            throw new Error(`Service "${name}" has never been registered`)
          }

          const executors = depsQueue.get(name)!

          // reject dependents
          if (depsQueue.has(name)) {
            for (const executor of executors) {
              executor[1](new Error(`Service "${name}" has been unregistered`))
            }
          }

          // release concurrency queue
          if (concurrencyQueue.has(name)) {
            concurrencyQueue.delete(name)
          }

          // unregister
          registry.delete(name)

          res.writeHead(200)
          res.end()

          break
        }

        default: {
          throw new Error(`Unknown pathname "${pathname}"`)
        }
      }
    } catch (err) {
      res.writeHead(500, err.message)
      res.end()
    }
  })

  const socketPath = await getSocketPath()

  await dleet(socketPath)
  server.listen(socketPath)
  await once(server, 'listening')

  return async () => {
    registry.clear()
    depsQueue.clear()
    concurrencyQueue.clear()
    server.close()
    await once(server, 'close')
    await dleet(socketPath)
  }
}
