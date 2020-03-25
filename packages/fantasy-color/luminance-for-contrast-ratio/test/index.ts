import test from 'tape'
import luminanceForContrastRatio from '../src'

test('luminance-for-contrast-ratio: larger luminance', (t) => {
  const luminance = luminanceForContrastRatio(3, 0.3)

  t.deepEquals(
    luminance,
    0.9999999999999998,
    'must give a larger luminance that matches the ratio'
  )

  t.end()
})

test('luminance-for-contrast-ratio: lower luminance', (t) => {
  const luminance = luminanceForContrastRatio(3, 0.8)

  t.deepEquals(
    luminance,
    0.2333333333333334,
    'must give a lower luminance that matches the ratio'
  )

  t.end()
})
