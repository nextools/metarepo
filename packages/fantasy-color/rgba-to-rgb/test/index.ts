import test from 'blue-tape'
import rgbaToRgb from '../src'

test('rgbaToRgb: standalone', async (t) => {
  const color = rgbaToRgb({
    red: 60,
    green: 32,
    blue: 23,
    alpha: 0.4,
  })

  await t.deepEquals(
    color,
    {
      red: 60,
      green: 32,
      blue: 23,
    },
    'must remove alpha'
  )
})

// test('rgbaToRgb: with background')
