import { createServer } from 'net'
import test from 'tape'
import { checkPort, getFreePort } from '../src'

test('portu: checkPort', async (t) => {
  const host = 'localhost'
  const port = await getFreePort(31337, 40000, host)
  const server = createServer()

  await new Promise((resolve, reject) => {
    server
      .unref()
      .on('error', reject)
      .on('listening', resolve)
      .listen(port, host)
  })

  let isFree = await checkPort(port, host)

  t.false(
    isFree,
    'should return false when port is not available'
  )

  await new Promise((resolve, reject) => {
    server.close((err) => {
      if (typeof err !== 'undefined') {
        reject(err)
      } else {
        resolve()
      }
    })
  })

  isFree = await checkPort(port, host)

  t.true(
    isFree,
    'should return true when port is free'
  )
})
