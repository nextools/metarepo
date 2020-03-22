import test from 'tape'
import rgbaToRgb from '../src'

test('rgbaToRgb: standalone', (t) => {
  const color = rgbaToRgb({
    red: 60,
    green: 32,
    blue: 23,
    alpha: 0.4,
  })

  t.deepEquals(
    color,
    {
      red: 60,
      green: 32,
      blue: 23,
    },
    'must remove alpha'
  )

  t.end()
})

// test('rgbaToRgb: with background')
