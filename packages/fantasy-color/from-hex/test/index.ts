import test from 'tape'
import fromHEX from '../src'

test('from-hex: valid', (t) => {
  const color = fromHEX('#FF0200')

  t.deepEquals(
    color,
    {
      red: 255,
      green: 2,
      blue: 0,
    },
    'must parse into object'
  )

  t.end()
})

test('from-hex: invalid', (t) => {
  const color = fromHEX('asdf00')

  t.equals(
    color,
    null,
    'must not parse'
  )

  t.end()
})
