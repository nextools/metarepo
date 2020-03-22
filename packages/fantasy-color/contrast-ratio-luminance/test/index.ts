import test from 'tape'
import contrastRatioLuminance from '../src'

test('contrast-ratio-luminance: first bigger', (t) => {
  const contrastRatio = contrastRatioLuminance(0.4, 0.9)

  t.deepEquals(
    contrastRatio,
    2.111111111111111,
    'must give contrast ratio'
  )

  t.end()
})

test('contrast-ratio-luminance: second bigger', (t) => {
  const contrastRatio = contrastRatioLuminance(0.9, 0.4)

  t.deepEquals(
    contrastRatio,
    2.111111111111111,
    'must give contrast ratio'
  )

  t.end()
})
