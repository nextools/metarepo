import test from 'blue-tape'
import { mock } from 'mocku'

test('codecov-lite', async (t) => {
  const unmock = mock('../src/index', {
    got: {
      default: {
        post: () => Promise.resolve({ body: 'HTTP 200\nreportURL' }),
      },
    },
    './getConfig': {
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

  unmock()
})
