import { mockRequire } from '@mock/require'
import WebSocket from 'isomorphic-ws'
import { toArrayAsync } from 'iterama'
import { getFreePort } from 'portu'
import { getRandomInt } from 'rndi'
import test from 'tape'

class MyWebSocket extends WebSocket {
  send(data: any, ...rest: any[]) {
    setTimeout(() => {
      super.send(data, ...rest)
    }, getRandomInt(20, 50))
  }
}

test('@iproto/*: client ← server', async (t) => {
  const unmockRequire = mockRequire('../src', {
    'isomorphic-ws': {
      default: MyWebSocket,
    },
  })
  const { getIterable } = await import('../src')
  const { serveIterable } = await import('../../server/src')

  let isDone = false
  const serverResult: any[] = []
  const serverIterable = {
    async *[Symbol.asyncIterator](): AsyncGenerator<number> {
      try {
        for (let i = 1; i <= 3; i++) {
          serverResult.push(yield i)
        }
      } finally {
        isDone = true
      }
    },
  }

  const host = 'localhost'
  const port = await getFreePort(31337, 40000, host)

  await serveIterable(serverIterable, { host, port })

  const clientIterable = getIterable<number>({ host, port })
  const clientResult = await toArrayAsync(clientIterable)

  t.true(
    isDone,
    'should finish iterating'
  )

  t.deepEqual(
    clientResult,
    [1, 2, 3],
    'should iterate on client'
  )

  t.deepEqual(
    serverResult,
    [undefined, undefined, undefined],
    'should get `undefined` client results on server'
  )

  unmockRequire()
})

test('@iproto/*: client ← server + break', async (t) => {
  const unmockRequire = mockRequire('../src', {
    'isomorphic-ws': {
      default: MyWebSocket,
    },
  })
  const { getIterable } = await import('../src')
  const { serveIterable } = await import('../../server/src')

  let isDone = false
  const serverResult: any[] = []
  const serverIterable = {
    async *[Symbol.asyncIterator](): AsyncGenerator<number> {
      try {
        for (let i = 1; i <= 3; i++) {
          serverResult.push(yield i)
        }
      } finally {
        isDone = true
      }
    },
  }

  const host = 'localhost'
  const port = await getFreePort(31337, 40000, host)

  await serveIterable(serverIterable, { host, port })

  const clientIterable = getIterable<number>({ host, port })
  const clientResult = []
  let i = 0

  for await (const value of clientIterable) {
    i++

    clientResult.push(value)

    if (i === 2) {
      break
    }
  }

  t.true(
    isDone,
    'should finish iterating'
  )

  t.deepEqual(
    clientResult,
    [1, 2],
    'should iterate on client'
  )

  t.deepEqual(
    serverResult,
    [undefined],
    'should get `undefined` client results on server'
  )

  unmockRequire()
})

test('@iproto/*: client ← server + error on open', async (t) => {
  // eslint-disable-next-line prefer-const
  let closeServer: () => Promise<void>
  const unmockRequire = mockRequire('../src', {
    'isomorphic-ws': {
      default: class extends MyWebSocket {
        on(event: string, listener: (...args: any[]) => void): this {
          if (event === 'open') {
            void closeServer()
          }

          return super.on(event, listener)
        }
      },
    },
  })
  const { getIterable } = await import('../src')
  const { serveIterable } = await import('../../server/src')

  let isDone = false
  const serverResult: any[] = []
  const serverIterable = {
    async *[Symbol.asyncIterator](): AsyncGenerator<number> {
      try {
        for (let i = 1; i <= 3; i++) {
          serverResult.push(yield i)
        }
      } finally {
        isDone = true
      }
    },
  }

  const host = 'localhost'
  const port = await getFreePort(31337, 40000, host)

  closeServer = await serveIterable(serverIterable, { host, port })

  const clientIterable = getIterable<number>({ host, port })
  const iterator = clientIterable[Symbol.asyncIterator]()

  try {
    await iterator.next()

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      `connect ECONNREFUSED 127.0.0.1:${port}`,
      'should throw error'
    )
  }

  t.false(
    isDone,
    'should not finish iterating'
  )

  unmockRequire()
})

test('@iproto/*: client ← server + close server error', async (t) => {
  const unmockRequire = mockRequire('../../server/src', {
    ws: {
      default: class extends WebSocket {
        static Server = class extends WebSocket.Server {
          close(cb: (err?: Error) => void) {
            cb(new Error('oops'))
            super.close()
          }
        }
      },
    },
  })
  const { serveIterable } = await import('../../server/src')

  const serverResult: any[] = []
  const serverIterable = {
    async *[Symbol.asyncIterator](): AsyncGenerator<number> {
      for (let i = 1; i <= 3; i++) {
        serverResult.push(yield i)
      }
    },
  }

  const host = 'localhost'
  const port = await getFreePort(31337, 40000, host)
  const closeServer = await serveIterable(serverIterable, { host, port })

  try {
    await closeServer()

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'oops',
      'should throw'
    )
  }

  unmockRequire()
})

test('@iproto/*: client ← server + close on message', async (t) => {
  const unmockRequire = mockRequire('../src', {
    'isomorphic-ws': {
      default: MyWebSocket,
    },
  })
  const { getIterable } = await import('../src')
  const { serveIterable } = await import('../../server/src')

  let isDone = false
  const serverResult: any[] = []
  const serverIterable = {
    async *[Symbol.asyncIterator](): AsyncGenerator<number> {
      try {
        for (let i = 1; i <= 3; i++) {
          serverResult.push(yield i)
        }
      } finally {
        isDone = true
      }
    },
  }

  const host = 'localhost'
  const port = await getFreePort(31337, 40000, host)
  const closeServer = await serveIterable(serverIterable, { host, port })

  const clientIterable = getIterable<number>({ host, port })
  const clientResult = []
  let i = 0

  try {
    for await (const value of clientIterable) {
      i++

      clientResult.push(value)

      if (i === 2) {
        await closeServer()
      }
    }

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'iproto: WebSocket has been closed with code 1006',
      'should throw error'
    )
  }

  t.false(
    isDone,
    'should not finish iterating'
  )

  t.deepEqual(
    clientResult,
    [1, 2],
    'should iterate on client'
  )

  t.deepEqual(
    serverResult,
    [undefined],
    'should not send client results on server'
  )

  unmockRequire()
})

test('@iproto/*: client ↔︎ server', async (t) => {
  const unmockRequire = mockRequire('../src', {
    'isomorphic-ws': {
      default: MyWebSocket,
    },
  })
  const { getIterable } = await import('../src')
  const { serveIterable } = await import('../../server/src')

  let isDone = false
  const serverResult: any[] = []
  const serverIterable = {
    async *[Symbol.asyncIterator](): AsyncGenerator<number> {
      try {
        for (let i = 1; i <= 3; i++) {
          serverResult.push(yield i)
        }
      } finally {
        isDone = true
      }
    },
  }

  const host = 'localhost'
  const port = await getFreePort(31337, 40000, host)

  await serveIterable(serverIterable, { host, port })

  const clientResult: number[] = []
  const clientIterable = getIterable<number>({ host, port })
  const iterator = clientIterable[Symbol.asyncIterator]()
  let iteratorResult = await iterator.next()

  while (iteratorResult.done !== true) {
    clientResult.push(iteratorResult.value)

    iteratorResult = await iterator.next(iteratorResult.value * 2)
  }

  t.true(
    isDone,
    'should finish iterating'
  )

  t.deepEqual(
    clientResult,
    [1, 2, 3],
    'should iterate on client'
  )

  t.deepEqual(
    serverResult,
    [2, 4, 6],
    'should get client results on server'
  )

  unmockRequire()
})

test('@iproto/*: client ↔︎ server + break', async (t) => {
  const unmockRequire = mockRequire('../src', {
    'isomorphic-ws': {
      default: MyWebSocket,
    },
  })
  const { getIterable } = await import('../src')
  const { serveIterable } = await import('../../server/src')

  let isDone = false
  const serverResult: any[] = []
  const serverIterable = {
    async *[Symbol.asyncIterator](): AsyncGenerator<number> {
      try {
        for (let i = 1; i <= 3; i++) {
          serverResult.push(yield i)
        }
      } finally {
        isDone = true
      }
    },
  }

  const host = 'localhost'
  const port = await getFreePort(31337, 40000, host)

  await serveIterable(serverIterable, { host, port })

  const clientResult: number[] = []
  const clientIterable = getIterable<number>({ host, port })
  const iterator = clientIterable[Symbol.asyncIterator]()
  let iteratorResult = await iterator.next()
  let i = 0

  while (iteratorResult.done !== true) {
    i++
    clientResult.push(iteratorResult.value)

    if (i === 2) {
      await iterator.return(undefined)

      break
    }

    iteratorResult = await iterator.next(iteratorResult.value * 2)
  }

  t.true(
    isDone,
    'should finish iterating'
  )

  t.deepEqual(
    clientResult,
    [1, 2],
    'should iterate on client'
  )

  t.deepEqual(
    serverResult,
    [2],
    'should get client results on server'
  )

  unmockRequire()
})
