import test from 'blue-tape'
import rgbToRgba from '../src'

test('rgbToRgba', async (t) => {
  const color = rgbToRgba({
    red: 60,
    green: 32,
    blue: 23,
  })

  await t.deepEquals(
    color,
    {
      red: 60,
      green: 32,
      blue: 23,
      alpha: 1,
    },
    'must add alpha 1'
  )
})
