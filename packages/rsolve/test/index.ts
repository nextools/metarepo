import test from 'blue-tape'
import { rsolve } from '../src'

test('bro-resolve: ok', async (t) => {
  const fixturePath = await rsolve('./fixtures/pkg1/', 'browser')

  t.equal(
    fixturePath,
    require.resolve('./fixtures/pkg1/index.browser.ts'),
    'should work'
  )
})

test('bro-resolve: throw', async (t) => {
  try {
    await rsolve('./fixtures/pkg2/', 'browser')
    t.fail('should not get here')
  } catch (e) {
    t.true(
      e.message.startsWith('Can\'t resolve \'./fixtures/pkg2/\' in'),
      'should throw'
    )
  }
})
