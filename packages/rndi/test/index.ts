import { mockRequire } from '@mock/require'
import test from 'tape'

test('rndi: getRandomInt + positive min/max', async (t) => {
  let random = 0

  const unmockRequire = mockRequire('../src', {
    globl: {
      Math: {
        random: () => random,
        floor: Math.floor,
      },
    },
  })

  const { getRandomInt } = await import('../src')

  const result1 = getRandomInt(50, 100)

  random = 0.3

  const result2 = getRandomInt(50, 100)

  random = 0.5

  const result3 = getRandomInt(50, 100)

  random = 0.7

  const result4 = getRandomInt(50, 100)

  t.deepEqual(
    [result1, result2, result3, result4],
    [50, 65, 75, 85],
    'should work'
  )

  unmockRequire()
})

test('rndi: getRandomInt + negative min/max', async (t) => {
  let random = 0

  const unmockRequire = mockRequire('../src', {
    globl: {
      Math: {
        random: () => random,
        floor: Math.floor,
      },
    },
  })

  const { getRandomInt } = await import('../src')

  const result1 = getRandomInt(-50, -100)

  random = 0.3

  const result2 = getRandomInt(-50, -100)

  random = 0.5

  const result3 = getRandomInt(-50, -100)

  random = 0.7

  const result4 = getRandomInt(-50, -100)

  t.deepEqual(
    [result1, result2, result3, result4],
    [-50, -65, -75, -85],
    'should work'
  )

  unmockRequire()
})
