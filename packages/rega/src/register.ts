import { getFreePort } from './get-free-port'
import type { TExecutors, TRegisterOptions, TRegisterResult, TDeps } from './types'

const registry = new Map<string, number>()
const depsQueue = new Map<string, TExecutors>()
const concurrencyQueue = new Set<Promise<number>>()

export const register = async ({ name, deps: depNames, fromPort, toPort }: TRegisterOptions): Promise<TRegisterResult> => {
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
      await Promise.all(concurrencyQueue)
    }

    const skipPorts = Array.from(registry.values())
    const portPromise = getFreePort(fromPort, toPort, skipPorts)

    concurrencyQueue.add(portPromise)

    port = await portPromise

    concurrencyQueue.delete(portPromise)

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

  if (Array.isArray(depNames)) {
    return {
      port,
      deps,
    }
  }

  return { port }
}

export const cleanup = () => {
  registry.clear()
  depsQueue.clear()
  concurrencyQueue.clear()
}
