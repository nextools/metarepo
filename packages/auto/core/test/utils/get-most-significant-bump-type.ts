import test from 'tape'
import { getMostSignificantBumpType } from '../../src/utils/get-most-significant-bump-type'

test('getMostSignificantBumpType', (t) => {
  t.equals(
    getMostSignificantBumpType([
      { type: 'patch', message: '' },
      { type: 'patch', message: '' },
    ]),
    'patch',
    'single type'
  )

  t.equals(
    getMostSignificantBumpType([
      { type: 'minor', message: '' },
      { type: 'patch', message: '' },
      { type: 'major', message: '' },
    ]),
    'major',
    'multiple types'
  )

  t.equals(
    getMostSignificantBumpType([
      { type: 'major', message: '' },
      { type: 'initial', message: '' },
      { type: 'patch', message: '' },
    ]),
    'initial',
    'initial is most significant'
  )

  t.throws(
    () => {
      getMostSignificantBumpType([])
    },
    /most significant bump type/
  )

  t.end()
})
