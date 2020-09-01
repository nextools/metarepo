import { suite } from '../src'

export default suite('check', ({ test }) => {
  test('ok', (check) => {
    check(
      { a: 1 },
      { a: 1 },
      'should be equal'
    )
  })

  test('not ok', (check) => {
    check(
      { a: 1 },
      { a: 2 },
      'should not be equal'
    )
  })

  test('error', () => {
    throw new Error('oops')
  })
})
