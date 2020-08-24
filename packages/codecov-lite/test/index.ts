import { mockRequire } from '@mock/require'
import test from 'tape'

test('codecov-lite', async (t) => {
  const unmockRequire = mockRequire('../src/index', {
    got: {
      default: {
        post: () => Promise.resolve({ body: 'HTTP 200\nreportURL' }),
      },
    },
    '../src/getConfig': {
      default: () => ({ foo: '1', bar: '2' }),
    },
  })

  const { default: codecov } = await import('../src/index')

  const result = await codecov('data')

  t.deepEqual(
    result,
    {
      reportURL: 'reportURL',
      config: {
        foo: '1',
        bar: '2',
      },
    },
    'should return result object'
  )

  unmockRequire()
})
