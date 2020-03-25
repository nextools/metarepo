import test from 'tape'
import normalizeRgb from '../src'

test('normalize-rgb', (t) => {
  const color = normalizeRgb({
    red: 255,
    green: 70,
    blue: 50,
  })

  t.deepEquals(
    color,
    {
      red: 1,
      green: 0.27450980392156865,
      blue: 0.19607843137254902,
    },
    'must normalize the values'
  )

  t.end()
})
