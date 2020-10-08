import { spawnChildProcessStream } from 'spown'
import test from 'tape'
import { killPortProcess, waitForPort } from '../src'

test('portu: killPortProcess + existing process', async (t) => {
  const host = 'localhost'
  const port = 31337
  const server = spawnChildProcessStream(`node -e "net.createServer().listen(${port}, '${host}')"`)
  const pOnExit = new Promise((resolve, reject) => {
    server
      .on('error', reject)
      .on('exit', (_, signal) => resolve(signal))
  })

  await waitForPort(port, host)

  const pid = await killPortProcess(port, host)
  const signal = await pOnExit

  t.equal(
    pid,
    server.pid,
    'should return pid of killed process'
  )

  t.equal(
    signal,
    'SIGKILL',
    'should SIGKILL process'
  )
})

test('portu: killPortProcess + non-existing process', async (t) => {
  const host = 'localhost'
  const port = 31377
  const pid = await killPortProcess(port, host)

  t.equal(
    pid,
    null,
    'should return null as pid of killed process'
  )
})
