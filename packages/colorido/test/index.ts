import test from 'tape'
import { isColor, colorToString } from '../src'

test('colorido: isColor', (t) => {
  t.false(
    isColor(''),
    'should return false on non-color'
  )

  t.false(
    isColor([1, 2, 3]),
    'should return false on non-color'
  )

  t.false(
    isColor([1, 2, 3, '']),
    'should return false on non-color'
  )

  t.true(
    isColor([255, 0, 0, 1]),
    'should return true on valid color'
  )

  t.end()
})

test('colorido: colorToString', (t) => {
  t.equal(
    colorToString([255, 0, 0, 1]),
    'rgba(255, 0, 0, 1)',
    'should return string on valid color'
  )

  t.end()
})
