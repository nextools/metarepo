import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock } from 'mocku'

test('codecov-lite', async (t) => {
  const postSpy = createSpy(() => Promise.resolve({ body: 'HTTP 200\nreportURL' }))
  const putSpy = createSpy(() => {})

  const unmock = mock('../src/index', {
    got: {
      default: {
        post: postSpy,
        put: putSpy,
      },
    },
    './getConfig': {
      default: () => ({ foo: '1', bar: '2' }),
    },
  })

  const { default: codecov } = await import('../src/index')

  const result = await codecov('data')

  t.deepEqual(
    getSpyCalls(postSpy),
    [
      [
        'https://codecov.io/upload/v2?foo=1&bar=2',
        {
          headers: {
            'Content-Type': 'text/plain',
            Accept: 'text/plain',
          },
          body: 'data',
          timeout: 10000,
          retry: 3,
        },
      ],
    ],
    'should send POST request'
  )

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
