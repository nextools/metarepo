import test from 'blue-tape'
import fromRGBA from '../src'

test('from-rgba: valid', async (t) => {
  const color = fromRGBA('   rgba(  255, 03,   4 , 0.5  )')

  await t.deepEquals(
    color,
    {
      red: 255,
      green: 3,
      blue: 4,
      alpha: 0.5,
    },
    'must parse into object'
  )
})

test('from-rgba: invalid', async (t) => {
  const color = fromRGBA('asdf00')

  await t.equals(
    color,
    null,
    'must not parse'
  )
})
