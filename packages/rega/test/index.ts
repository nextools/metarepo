import { once } from 'events'
import { createServer } from 'net'
import { sleep } from 'sleap'
import test from 'tape'
import { startServer, registerService } from '../src'

const startOnPort = async (port: number): Promise<() => Promise<void>> => {
  const server = createServer()

  server.unref()
  server.listen(port, 'localhost')

  await once(server, 'listening')

  return async () => {
    server.close()

    await once(server, 'close')
  }
}

test('rega: concurrency queue', async (t) => {
  const stopServer = await startServer()

  try {
    const [foo, bar] = await Promise.all([
      registerService({
        name: 'foo',
        fromPort: 3000,
        toPort: 4000,
      }),
      registerService({
        name: 'bar',
        fromPort: 3000,
        toPort: 4000,
      }),
    ])

    t.deepEqual(
      foo,
      { port: 3000 },
      'should register foo service'
    )

    t.deepEqual(
      bar,
      { port: 3001 },
      'should register bar service'
    )
  } finally {
    await stopServer()
  }
})

test('rega: deps queue', async (t) => {
  const stopServer = await startServer()

  try {
    const fooP = registerService({
      name: 'foo',
      fromPort: 3000,
      toPort: 4000,
      deps: ['bar'],
    })
    const barP = registerService({
      name: 'bar',
      fromPort: 3000,
      toPort: 4000,
    })
    const bazP = registerService({
      name: 'baz',
      fromPort: 3000,
      toPort: 4000,
      deps: ['foo', 'bar'],
    })
    const quxP = registerService({
      name: 'qux',
      fromPort: 3000,
      toPort: 4000,
      deps: ['foo', 'bar'],
    })

    const bar = await barP
    const fooStartTime = Date.now()
    let closeBar: () => Promise<void>

    void sleep(50)
      .then(() => startOnPort(bar.port))
      .then((close) => {
        closeBar = close
      })

    const foo = await fooP
    const fooTime = Date.now() - fooStartTime
    const bazQuxStartTime = Date.now()
    let closeFoo: () => Promise<void>

    void sleep(50)
      .then(() => startOnPort(foo.port))
      .then((close) => {
        closeFoo = close
      })

    const baz = await bazP
    const qux = await quxP
    const bazQuxTime = Date.now() - bazQuxStartTime

    t.true(
      fooTime >= 250,
      'should wait for bar service port to become in use'
    )

    t.deepEqual(
      foo,
      { port: 3001, deps: { bar: 3000 } },
      'should wait for deps and register foo service'
    )

    t.deepEqual(
      bar,
      { port: 3000 },
      'should register bar service'
    )

    t.true(
      bazQuxTime >= 250,
      'should wait for foo service port to become in use'
    )

    t.deepEqual(
      baz,
      { port: 3002, deps: { foo: 3001, bar: 3000 } },
      'should wait for deps and register baz service'
    )

    t.deepEqual(
      qux,
      { port: 3003, deps: { foo: 3001, bar: 3000 } },
      'should wait for deps and register qux service'
    )

    await closeFoo!()
    await closeBar!()
  } finally {
    await stopServer()
  }
})

test('rega: already registered error', async (t) => {
  const stopServer = await startServer()

  try {
    await registerService({
      name: 'foo',
      fromPort: 3000,
      toPort: 4000,
    })

    await registerService({
      name: 'foo',
      fromPort: 3000,
      toPort: 4000,
    })

    t.fail('should not get here')
  } catch (err) {
    t.equal(
      err.message,
      'Service "foo" is already registered',
      'should throw error'
    )
  } finally {
    await stopServer()
  }
})

test('rega: no port error', async (t) => {
  const stopServer = await startServer()

  try {
    await registerService({
      name: 'foo',
      fromPort: 3000,
      toPort: 3001,
    })

    await registerService({
      name: 'bar',
      fromPort: 3000,
      toPort: 3001,
    })

    await registerService({
      name: 'baz',
      fromPort: 3000,
      toPort: 3001,
    })

    t.fail('should not get here')
  } catch (err) {
    t.equal(
      err.message,
      'Unable to find free port within 3000-3001 range',
      'should throw error'
    )
  } finally {
    await stopServer()
  }
})
