import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'

test('sleap: sleep', async (t) => {
  const setTimeoutSpy = createSpy(({ args }) => {
    args[0]()
  })
  const unmockRequire = mockRequire('../src', {
    globl: {
      setTimeout: setTimeoutSpy,
    },
  })
  const { sleep } = await import('../src')

  await sleep(1000)

  const result = getSpyCalls(setTimeoutSpy)

  t.equal(
    result.length,
    1,
    'should call setTimeout only once'
  )

  t.deepEqual(
    result[0][1],
    1000,
    'should work'
  )

  unmockRequire()
})
