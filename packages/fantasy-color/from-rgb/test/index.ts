import test from 'tape'
import fromRGB from '../src'

test('from-rgb: valid', (t) => {
  const color = fromRGB('rgb(  255, 03,   4   )')

  t.deepEquals(
    color,
    {
      red: 255,
      green: 3,
      blue: 4,
    },
    'must parse into object'
  )

  t.end()
})

test('from-rgb: invalid', (t) => {
  const color = fromRGB('asdf00')

  t.equals(
    color,
    null,
    'must not parse'
  )

  t.end()
})
