import test from 'tape'
import { normalizeStyle as normalizeStyleWeb } from '../src/index.web'
import { normalizeStyle as normalizeStyleNative } from '../src/index.native'

test('stili: normalizeStyle + web', (t) => {
  t.deepEqual(
    normalizeStyleWeb({
      userSelect: 'none',
      tapHighlightColor: 'rgba(0, 0, 0, 0)',
      fontSmoothing: 'antialiased',
      appearance: 'none',
      fontSize: 16,
    }),
    {
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      userSelect: 'none',
      WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
      WebkitFontSmoothing: 'antialiased',
      WebkitAppearance: 'none',
      MozAppearance: 'none',
      appearance: 'none',
      fontSize: 16,
    },
    'should work'
  )

  t.end()
})

test('stili: normalizeStyle + native', (t) => {
  t.deepEqual(
    normalizeStyleNative({
      fontWeight: 200,
      fontSize: 16,
    }),
    {
      fontWeight: '200',
      fontSize: 16,
    },
    'should work'
  )

  t.deepEqual(
    normalizeStyleNative({
      fontWeight: undefined,
    }),
    {
      fontWeight: undefined,
    },
    'should skip undefined font weight'
  )

  t.end()
})
