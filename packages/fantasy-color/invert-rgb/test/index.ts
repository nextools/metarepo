import test from 'blue-tape'
import invertRgb from '../src'

test('invertRgb', async (t) => {
  const color = invertRgb({
    red: 127,
    green: 255,
    blue: 60,
  })

  await t.deepEquals(
    color,
    {
      red: 128,
      green: 0,
      blue: 195,
    },
    'must invert the RGB'
  )
})
