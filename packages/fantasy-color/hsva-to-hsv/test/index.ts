import test from 'blue-tape'
import hsvaToHsv from '../src'

test('hsvaToHsv: standalone', async (t) => {
  const color = hsvaToHsv({
    hue: 60,
    saturation: 32,
    value: 23,
    alpha: 0.4,
  })

  await t.deepEquals(
    color,
    {
      hue: 60,
      saturation: 32,
      value: 23,
    },
    'must remove alpha'
  )
})

// test('hsvaToHsv: with background')
