import test from 'tape'
import hsvaToHsv from '../src'

test('hsvaToHsv: standalone', (t) => {
  const color = hsvaToHsv({
    hue: 60,
    saturation: 32,
    value: 23,
    alpha: 0.4,
  })

  t.deepEquals(
    color,
    {
      hue: 60,
      saturation: 32,
      value: 23,
    },
    'must remove alpha'
  )

  t.end()
})

// test('hsvaToHsv: with background')
