import test from 'tape'
import contrastRatioRgb from '../src'

test('fantasy-color:contrast-ratio-rgb', (t) => {
  const contrastRatio = contrastRatioRgb(
    {
      red: 255,
      green: 0,
      blue: 0,
    },
    {
      red: 0,
      green: 0,
      blue: 0,
    }
  )

  t.deepEquals(
    contrastRatio,
    5.252,
    'must give contrast ratio'
  )

  t.end()
})
