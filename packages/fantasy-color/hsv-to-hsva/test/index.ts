import test from 'blue-tape'
import hsvToHsva from '../src'

test('hsvToHsva', async (t) => {
  const color = hsvToHsva({
    hue: 60,
    saturation: 32,
    value: 23,
  })

  await t.deepEquals(
    color,
    {
      hue: 60,
      saturation: 32,
      value: 23,
      alpha: 1,
    },
    'must add alpha 1'
  )
})
