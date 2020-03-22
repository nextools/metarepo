import test from 'tape'
import rgbToSrgb from '../src'

test('rgbToSrgb: below 9 values', (t) => {
  const color = rgbToSrgb({
    red: 7,
    green: 6,
    blue: 2,
  })

  t.deepEquals(
    color,
    {
      red: 0.0021246888848418626,
      green: 0.001821161901293025,
      blue: 0.000607053967097675,
    },
    'must map to sRGB'
  )

  t.end()
})

test('rgbToSrgb: above 9 values', (t) => {
  const color = rgbToSrgb({
    red: 78,
    green: 63,
    blue: 22,
  })

  t.deepEquals(
    color,
    {
      red: 0.07618538148130785,
      green: 0.04970656598412723,
      blue: 0.008023192985384994,
    },
    'must map to sRGB'
  )

  t.end()
})
