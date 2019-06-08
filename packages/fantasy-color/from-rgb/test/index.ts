import test from 'blue-tape'
import fromRGB from '../src'

test('from-rgb: valid', async (t) => {
  const color = fromRGB('rgb(  255, 03,   4   )')

  await t.deepEquals(
    color,
    {
      red: 255,
      green: 3,
      blue: 4,
    },
    'must parse into object'
  )
})

test('from-rgb: invalid', async (t) => {
  const color = fromRGB('asdf00')

  await t.equals(
    color,
    null,
    'must not parse'
  )
})
