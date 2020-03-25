import test from 'tape'
import invertRgb from '../src'

test('invertRgb', (t) => {
  const color = invertRgb({
    red: 127,
    green: 255,
    blue: 60,
  })

  t.deepEquals(
    color,
    {
      red: 128,
      green: 0,
      blue: 195,
    },
    'must invert the RGB'
  )

  t.end()
})
