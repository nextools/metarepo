import test from 'blue-tape'
import { createSpy, getSpyCalls } from '../src'

test('spyfn: return result', (t) => {
  const spy = createSpy((props) => props)

  t.deepEqual(
    spy(1, 2, 3),
    { index: 0, args: [1, 2, 3] },
    'should pass index + args and return a result, call 1'
  )

  t.deepEqual(
    spy(4, 5, 6),
    { index: 1, args: [4, 5, 6] },
    'should pass index + args and return a result, call 2'
  )

  t.end()
})

test('spyfn: get calls', (t) => {
  const spy = createSpy(() => {})

  spy()
  spy(1)

  t.deepEqual(
    getSpyCalls(spy),
    [[], [1]],
    'should return an array of call args array, call 1'
  )

  spy(1, 2, 3)
  spy()

  t.deepEqual(
    getSpyCalls(spy),
    [[], [1], [1, 2, 3], []],
    'should return an array of call args array, call 2'
  )

  t.end()
})

test('spyfn: throw an error', (t) => {
  const spy = createSpy(({ index }) => {
    if (index === 1) {
      throw new Error()
    }
  })

  spy(1)

  try {
    spy(2)
  } catch (e) {
    t.pass('should throw error')
  }

  t.deepEqual(
    getSpyCalls(spy),
    [[1], [2]],
    'should save call args before error occurs'
  )

  t.end()
})
