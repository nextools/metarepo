import test from 'tape'
import hsvToHsva from '../src'

test('hsvToHsva', (t) => {
  const color = hsvToHsva({
    hue: 60,
    saturation: 32,
    value: 23,
  })

  t.deepEquals(
    color,
    {
      hue: 60,
      saturation: 32,
      value: 23,
      alpha: 1,
    },
    'must add alpha 1'
  )

  t.end()
})
