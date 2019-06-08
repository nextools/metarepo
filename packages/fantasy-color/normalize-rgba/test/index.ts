import test from 'blue-tape'
import normalizeRgba from '../src'

test('normalize-rgba', async (t) => {
  const color = normalizeRgba({
    red: 255,
    green: 70,
    blue: 50,
    alpha: 0.4,
  })

  await t.deepEquals(
    color,
    {
      red: 1,
      green: 0.27450980392156865,
      blue: 0.19607843137254902,
      alpha: 0.4,
    },
    'must normalize the values'
  )
})
