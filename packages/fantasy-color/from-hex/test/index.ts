import test from 'blue-tape'
import fromHEX from '../src'

test('from-hex: valid', async (t) => {
  const color = fromHEX('#FF0200')

  await t.deepEquals(
    color,
    {
      red: 255,
      green: 2,
      blue: 0,
    },
    'must parse into object'
  )
})

test('from-hex: invalid', async (t) => {
  const color = fromHEX('asdf00')

  await t.equals(
    color,
    null,
    'must not parse'
  )
})
