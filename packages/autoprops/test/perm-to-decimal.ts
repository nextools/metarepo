import test from 'blue-tape'
import { permToDecimal } from '../src/perm-to-decimal'

test('permToDecimal', (t) => {
  const length = [2n, 3n, 4n]
  const values = [
    [0n, 0n, 0n],
    [1n, 0n, 0n],
    [0n, 1n, 0n],
    [1n, 1n, 0n],
    [0n, 2n, 0n],
    [1n, 2n, 0n],
    [0n, 0n, 1n],
    [1n, 0n, 1n],
    [0n, 1n, 1n],
    [1n, 1n, 1n],
    [0n, 2n, 1n],
    [1n, 2n, 1n],
    [0n, 0n, 2n],
    [1n, 0n, 2n],
    [0n, 1n, 2n],
    [1n, 1n, 2n],
    [0n, 2n, 2n],
    [1n, 2n, 2n],
    [0n, 0n, 3n],
    [1n, 0n, 3n],
    [0n, 1n, 3n],
    [1n, 1n, 3n],
    [0n, 2n, 3n],
    [1n, 2n, 3n],
  ]

  t.deepEquals(
    values.map((values) => permToDecimal(values, length)),
    [0n, 1n, 2n, 3n, 4n, 5n, 6n, 7n, 8n, 9n, 10n, 11n, 12n, 13n, 14n, 15n, 16n, 17n, 18n, 19n, 20n, 21n, 22n, 23n],
    'should return correct decimal'
  )

  t.end()
})
