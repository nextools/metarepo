import test from 'tape'
import { applyMask, getPositionInMasked, getPositionInValue, isLongerThanMask } from '..'

test('msked: getPositionInMasked', (t) => {
  t.equals(
    getPositionInMasked(
      '20192',
      [null, null, null, null, '-', null, null, '-', null, null],
      4
    ),
    5,
    'should be 5'
  )
  t.equals(
    getPositionInMasked(
      '20192',
      [null, null, null, null, '-', null, null, '-', null, null],
      3
    ),
    3,
    'should be 3'
  )
  t.equals(
    getPositionInMasked(
      '2019-2',
      [null, null, null, null, '-', null, null, '-', null, null],
      5
    ),
    5,
    'should be 5'
  )
  t.equals(
    getPositionInMasked(
      '020',
      [null],
      0
    ),
    0,
    'should be 0'
  )
  t.equals(
    getPositionInMasked(
      '020',
      ['-', null],
      0
    ),
    1,
    'should be 1'
  )
  t.equals(
    getPositionInMasked(
      '-020',
      ['-', null],
      0
    ),
    0,
    'should be 0'
  )
  t.equals(
    getPositionInMasked(
      '',
      ['-', null],
      0
    ),
    1,
    'should be 1'
  )

  // What this means is that it will not fail on overflowing.
  // If the requested position is past the size of the mask,
  // the result will be clipped to the mask length
  t.equals(
    getPositionInMasked(
      '12',
      [],
      1
    ),
    0,
    'should be 0'
  )

  t.equals(
    getPositionInMasked(
      '12',
      [],
      0
    ),
    0,
    'should be 0'
  )

  t.end()
})

test('msked: getPositionInValue', (t) => {
  t.equals(
    getPositionInValue(
      '20192',
      [null, null, null, null, '-', null, null, '-', null, null],
      5
    ),
    4,
    'should be 4'
  )
  t.equals(
    getPositionInValue(
      '20192',
      [null, null, null, null, '-', null, null, '-', null, null],
      3
    ),
    3,
    'should be 3'
  )
  t.equals(
    getPositionInValue(
      'va',
      [],
      0
    ),
    0,
    'should be 0'
  )
  t.equals(
    getPositionInValue(
      'va',
      [null],
      0
    ),
    0,
    'should be 0'
  )
  t.equals(
    getPositionInValue(
      '-va',
      ['-', null],
      0
    ),
    0,
    'should be 0'
  )
  t.equals(
    getPositionInValue(
      'va',
      ['-', null],
      0
    ),
    0,
    'should be 0'
  )
  t.equals(
    getPositionInValue(
      'va',
      ['-', null],
      1
    ),
    0,
    'should be 0'
  )
  t.equals(
    getPositionInValue(
      'va',
      [null],
      1
    ),
    1,
    'should be 1'
  )
  t.equals(
    getPositionInValue(
      '-va',
      ['-', null],
      1
    ),
    1,
    'should be 1'
  )
  t.equals(
    getPositionInValue(
      '2019-2',
      [null, null, null, null, '-', null, null, '-', null, null],
      5
    ),
    5,
    'should be 5'
  )

  t.end()
})

test('msked: applyMask', (t) => {
  t.equals(
    applyMask(
      '20192',
      [null, null, null, null, '-', null, null, '-', null, null]
    ),
    '2019-2',
    'should be 2019-2'
  )

  t.equals(
    applyMask(
      '2019-2',
      [null, null, null, null, '-', null, null, '-', null, null]
    ),
    '2019-2',
    'should be 2019-2'
  )

  t.equals(
    applyMask(
      '2019-2123',
      [null, null, null, null, '-', null, null, '-', null, null]
    ),
    '2019-21-23',
    'should be 2019-21-23'
  )

  t.equals(
    applyMask(
      '',
      ['-']
    ),
    '',
    'should be empty'
  )

  t.equals(
    applyMask(
      '-',
      [null, null, null, null, '-', null, null, '-', null, null]
    ),
    '-',
    'should be -'
  )

  t.equals(
    applyMask(
      '12341324124312432143124',
      [null, null, null, null, '-', null, null, '-', null, null]
    ),
    '1234-13-24',
    'should be 1234-13-24'
  )

  t.end()
})

test('msked: isLongerThanMask', (t) => {
  t.equals(
    isLongerThanMask(
      '2019-2123',
      [null, null, null, null, '-', null, null, '-', null, null]
    ),
    false,
    'should be false'
  )

  t.equals(
    isLongerThanMask(
      '',
      ['-']
    ),
    false,
    'should be false'
  )

  t.equals(
    isLongerThanMask(
      '-',
      [null, null, null, null, '-', null, null, '-', null, null]
    ),
    false,
    'should be false'
  )

  t.equals(
    isLongerThanMask(
      '12341324124312432143124',
      [null, null, null, null, '-', null, null, '-', null, null]
    ),
    true,
    'should be true'
  )

  t.equals(
    isLongerThanMask(
      '20192123',
      [null, null, null, null, '-', null, null, '-', null, null]
    ),
    false,
    'should be false'
  )

  t.equals(
    isLongerThanMask(
      '2019-21-23',
      [null, null, null, null, '-', null, null, '-', null, null]
    ),
    false,
    'should be false'
  )

  t.equals(
    isLongerThanMask(
      '20192123--',
      [null, null, null, null, '-', null, null, '-', null, null]
    ),
    true,
    'should be true'
  )

  t.end()
})
