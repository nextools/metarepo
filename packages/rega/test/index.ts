import test from 'tape'
import { startServer, registerService } from '../src'

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
    const [foo, bar, baz, qux] = await Promise.all([
      registerService({
        name: 'foo',
        fromPort: 3000,
        toPort: 4000,
        deps: ['bar'],
      }),
      registerService({
        name: 'bar',
        fromPort: 3000,
        toPort: 4000,
      }),
      registerService({
        name: 'baz',
        fromPort: 3000,
        toPort: 4000,
        deps: ['foo', 'bar'],
      }),
      registerService({
        name: 'qux',
        fromPort: 3000,
        toPort: 4000,
        deps: ['foo', 'bar'],
      }),
    ])

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

    t.deepEqual(
      baz,
      { port: 3002, deps: { foo: 3001, bar: 3000 } },
      'shouldwait for deps and register baz service'
    )

    t.deepEqual(
      qux,
      { port: 3003, deps: { foo: 3001, bar: 3000 } },
      'shouldwait for deps and register qux service'
    )
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
