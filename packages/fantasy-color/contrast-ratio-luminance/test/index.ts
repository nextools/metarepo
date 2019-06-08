import test from 'blue-tape'
import contrastRatioLuminance from '../src'

test('contrast-ratio-luminance: first bigger', async (t) => {
  const contrastRatio = contrastRatioLuminance(0.4, 0.9)

  await t.deepEquals(
    contrastRatio,
    2.111111111111111,
    'must give contrast ratio'
  )
})

test('contrast-ratio-luminance: second bigger', async (t) => {
  const contrastRatio = contrastRatioLuminance(0.9, 0.4)

  await t.deepEquals(
    contrastRatio,
    2.111111111111111,
    'must give contrast ratio'
  )
})
