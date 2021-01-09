import { createServer } from 'net'
import { mockRequire } from '@mock/require'
import test from 'tape'

test('portu: getPortProcess', async (t) => {
  const { getFreePort, getPortProcess } = await import('../src')

  const host = 'localhost'
  const port = await getFreePort(31337, 40000, host)
  const server = createServer()

  await new Promise((resolve, reject) => {
    server
      .unref()
      .on('error', reject)
      .on('listening', resolve)
      .listen(port, 'localhost')
  })

  let pid = await getPortProcess(port, host)

  t.equal(
    pid,
    process.pid,
    'should return pid'
  )

  pid = await getPortProcess(port + 1, host)

  t.equal(
    pid,
    null,
    'should return null if port is free'
  )

  await new Promise<void>((resolve, reject) => {
    server.close((err) => {
      if (typeof err !== 'undefined') {
        reject(err)
      } else {
        resolve()
      }
    })
  })
})

test('portu: getPortProcess + spawn error', async (t) => {
  const unmockRequire = mockRequire('../src', {
    spown: {
      spawnChildProcess: () => Promise.reject(new Error('oops')),
    },
  })

  const { getPortProcess } = await import('../src')

  try {
    await getPortProcess(31337, 'localhost')

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'oops',
      'should propagate spawn errors'
    )
  }

  unmockRequire()
})
