import { mockRequire } from '@mock/require'
import { pipe } from 'funcom'
import { takeAsync, toArrayAsync } from 'iterama'
import test from 'tape'

test('ifps: iterableFps', async (t) => {
  let i = 1
  const unmockRequire = mockRequire('../src', {
    globl: {
      requestAnimationFrame: (callback: (time: number) => void) => {
        callback(i++)
      },
      performance: {
        now: () => 0,
      },
    },
  })

  const { iterableFps } = await import('../src')

  const result = await pipe(
    takeAsync(3),
    toArrayAsync
  )(iterableFps)

  t.deepEqual(
    result,
    [1000, 1000, 1000],
    'should return FPS'
  )

  unmockRequire()
})
