import test from 'blue-tape'
import luminanceForContrastRatio from '../src'

test('luminance-for-contrast-ratio: larger luminance', async (t) => {
  const luminance = luminanceForContrastRatio(3, 0.3)

  await t.deepEquals(
    luminance,
    0.9999999999999998,
    'must give a larger luminance that matches the ratio'
  )
})

test('luminance-for-contrast-ratio: lower luminance', async (t) => {
  const luminance = luminanceForContrastRatio(3, 0.8)

  await t.deepEquals(
    luminance,
    0.2333333333333334,
    'must give a lower luminance that matches the ratio'
  )
})
