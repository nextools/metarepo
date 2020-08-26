import { reporter } from './reporter'
import { suite } from '.'

export const main = async () => {
  const runSuite = suite('foo', ({ test, onSuite, onTest }) => {
    onSuite(async () => {
      await Promise.resolve()
      // console.log('before suite')

      return async () => {
        await Promise.resolve()
        // console.log('after suite')
      }
    })

    onTest(async () => {
      await Promise.resolve()
      // console.log('before test')

      return async () => {
        await Promise.resolve()
        // console.log('after test')
      }
    })

    test('test 1', async (check) => {
      await Promise.resolve()

      check(
        { a: 2 },
        { a: 2 },
        'should be fine'
      )

      check(
        {
          a: 2,
          foo: true,
          bar: null,
        },
        'should be fine 2'
      )
    })

    test('test 2', async (check) => {
      await Promise.resolve()

      check(
        { a: 1 },
        { a: 2 },
        'should be fine'
      )
    })
  })

  const result = await runSuite(reporter)

  console.log('-----------------------------------------------------')
  console.log(result)
}
