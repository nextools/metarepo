import { spawnChildProcess } from 'spown'
import test from 'tape'

test('nextools/typescript-esm-loader', async (t) => {
  const loaderPath = require.resolve('../src/')
  const fixturePath = require.resolve('./fixtures/root.ts')

  const { stdout } = await spawnChildProcess(`node --experimental-import-meta-resolve --experimental-loader ${loaderPath} ${fixturePath}`)

  t.equal(
    stdout,
    '2',
    'should work'
  )
})
