import test from 'tape'
import { bumpRange } from '../../src/bump/bump-range'

test('bumpRange', (t) => {
  t.equals(
    bumpRange('0.1.0', '0.1.1', 'patch'),
    '0.1.1',
    'no symbol + patch'
  )

  t.equals(
    bumpRange('~0.1.0', '0.1.1', 'patch'),
    '~0.1.1',
    'tilda + patch'
  )

  t.equals(
    bumpRange('^0.1.0', '0.1.1', 'patch'),
    '^0.1.1',
    'hat + patch'
  )

  t.equals(
    bumpRange('0.1.0', '0.2.0', 'minor'),
    '0.2.0',
    'no symbol + minor'
  )

  t.equals(
    bumpRange('~0.1.0', '0.2.0', 'minor'),
    '^0.2.0',
    'tilda + minor'
  )

  t.equals(
    bumpRange('^0.1.0', '0.2.0', 'minor'),
    '^0.2.0',
    'hat + minor'
  )

  t.equals(
    bumpRange('0.1.0', '1.0.0', 'major'),
    '1.0.0',
    'no symbol + major'
  )

  t.equals(
    bumpRange('~0.1.0', '1.0.0', 'major'),
    '^1.0.0',
    'tilda + major'
  )

  t.equals(
    bumpRange('^0.1.0', '1.0.0', 'major'),
    '^1.0.0',
    'hat + major'
  )

  try {
    bumpRange('>=0.1.0', '0.2.0', 'major')

    t.fail('should not get here')
  } catch (e) {
    t.equals(
      e.message,
      'range ">=0.1.0" is not supported',
      'should throw'
    )
  }

  t.end()
})
