import test from 'blue-tape'
import { createSpy, getSpyCalls } from 'spyfn'
import { mock, unmock } from 'mocku'

test('codecov-lite', async (t) => {
  const postSpy = createSpy(() => Promise.resolve({ body: 'reportURL\nputURL' }))
  const putSpy = createSpy(() => {})

  mock('../src/index', {
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
        'https://codecov.io/upload/v4?foo=1&bar=2',
        {
          headers: {
            'Content-Type': 'text/plain',
            Accept: 'text/plain',
          },
          body: '',
          timeout: 5000,
          retry: 3,
        },
      ],
    ],
    'should send POST request'
  )

  t.deepEqual(
    getSpyCalls(putSpy),
    [
      [
        'putURL',
        {
          headers: {
            'Content-Type': 'text/plain',
            'x-amz-acl': 'public-read',
          },
          body: 'data',
          timeout: 5000,
          retry: 3,
        },
      ],
    ],
    'should send PUT request'
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

  unmock('../src/index')
})
