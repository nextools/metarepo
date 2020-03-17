import test from 'blue-tape'
import { checkChromeScreenshots } from '../src'

test('@x-ray/chrome: checkChromeScreenshots', async (t) => {
  const result = await checkChromeScreenshots()

  t.equal(
    result,
    123,
    'should work'
  )
})
