import path from 'path'
import { fileURLToPath } from 'url'
import { parentPort } from 'worker_threads'
import { transformAsync } from '@babel/core'
import resolveFrom from 'resolve-from'
import { once } from 'wans'

const resolve = (specifier) => {
  const dir = path.dirname(fileURLToPath(import.meta.url))

  return resolveFrom(dir, specifier)
}

const cache = new Map()

while (true) {
  try {
    const { arg, fnString, callerDir } = await once(parentPort, 'message')
    const key = `${callerDir}@${fnString}}`
    let fn

    if (cache.has(key)) {
      fn = cache.get(key)
    } else {
      const transformed = await transformAsync(fnString, {
        ast: false,
        babelrc: false,
        compact: true,
        inputSourceMap: false,
        presets: [
          [
            resolve('@babel/preset-env'),
            {
              targets: { node: 'current' },
              ignoreBrowserslistConfig: true,
              modules: false,
            },
          ],
        ],
        plugins: [
          [
            resolve('./babel-plugin.mjs'),
            { callerDir },
          ],
        ],
      })

      // eslint-disable-next-line no-new-func
      fn = new Function(`return ${transformed.code}`)()

      cache.set(key, fn)
    }

    const result = await fn(arg)

    parentPort.postMessage({
      type: 'DONE',
      value: result,
    })
  } catch (err) {
    parentPort.postMessage({
      type: 'ERROR',
      value: err.stack ?? err,
    })
  }
}
