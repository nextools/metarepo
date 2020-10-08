import { spawnChildProcessStream } from 'spown'
import test from 'tape'

test('portu: waitForPort + same default host', async (t) => {
  const { waitForPort } = await import('../src')

  const host = 'localhost'
  const port = 31337
  const server = spawnChildProcessStream(`node -e "net.createServer().listen(${port}, '${host}')"`)

  await waitForPort(port, host)

  server.kill()

  t.pass('should wait')
})
