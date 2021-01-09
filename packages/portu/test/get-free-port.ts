import { createServer } from 'net'
import test from 'tape'
import { getFreePort } from '../src'

test('portu: getFreePort', async (t) => {
  const host = 'localhost'
  const from = 31337
  const to = from + 1
  const port1 = await getFreePort(from, to, host)

  t.true(
    port1 >= from && port1 <= to,
    'should return first free port within provided range'
  )

  const server1 = createServer()

  await new Promise((resolve, reject) => {
    server1
      .unref()
      .on('error', reject)
      .on('listening', resolve)
      .listen(port1, host)
  })

  const port2 = await getFreePort(from, to, host)

  t.true(
    port2 - port1 >= 1,
    'should return next available port within a range'
  )

  const server2 = createServer()

  await new Promise((resolve, reject) => {
    server2
      .unref()
      .on('error', reject)
      .on('listening', resolve)
      .listen(port2, host)
  })

  try {
    await getFreePort(from, to, host)

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      `Unable to find free port within ${from}-${to} range`,
      'should throw if there are no free ports withing range'
    )
  }

  await new Promise<void>((resolve, reject) => {
    server1.close((err) => {
      if (typeof err !== 'undefined') {
        reject(err)
      } else {
        resolve()
      }
    })
  })

  await new Promise<void>((resolve, reject) => {
    server2.close((err) => {
      if (typeof err !== 'undefined') {
        reject(err)
      } else {
        resolve()
      }
    })
  })
})
