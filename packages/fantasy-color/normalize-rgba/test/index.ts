import test from 'tape'
import normalizeRgba from '../src'

test('normalize-rgba', (t) => {
  const color = normalizeRgba({
    red: 255,
    green: 70,
    blue: 50,
    alpha: 0.4,
  })

  t.deepEquals(
    color,
    {
      red: 1,
      green: 0.27450980392156865,
      blue: 0.19607843137254902,
      alpha: 0.4,
    },
    'must normalize the values'
  )

  t.end()
})
