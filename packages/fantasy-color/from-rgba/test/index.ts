import test from 'tape'
import fromRGBA from '../src'

test('from-rgba: valid', (t) => {
  const color = fromRGBA('   rgba(  255, 03,   4 , 0.5  )')

  t.deepEquals(
    color,
    {
      red: 255,
      green: 3,
      blue: 4,
      alpha: 0.5,
    },
    'must parse into object'
  )

  t.end()
})

test('from-rgba: invalid', (t) => {
  const color = fromRGBA('asdf00')

  t.equals(
    color,
    null,
    'must not parse'
  )

  t.end()
})
