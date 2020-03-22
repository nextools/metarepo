import test from 'tape'
import rgbToRgba from '../src'

test('rgbToRgba', (t) => {
  const color = rgbToRgba({
    red: 60,
    green: 32,
    blue: 23,
  })

  t.deepEquals(
    color,
    {
      red: 60,
      green: 32,
      blue: 23,
      alpha: 1,
    },
    'must add alpha 1'
  )

  t.end()
})
