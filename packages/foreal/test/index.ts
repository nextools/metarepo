import test from 'tape'
import { getAppPage } from '../src'

test('foreal: runApp', async (t) => {
  const app = await getAppPage({
    entryPointPath: require.resolve('./fixtures/App.tsx'),
  })

  const result = await app.$eval('h1', (el) => el.textContent)

  t.equal(
    result,
    'hi',
    'should work'
  )

  await app.close()
})
