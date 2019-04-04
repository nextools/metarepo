import test from 'blue-tape'
import { getFilenames } from '../src/get-filenames'
import { getKeys } from '../src/get-keys'
import { getPermutations } from '../src/get-permutations'

test('Get Filename: boolean and string', async (t) => {
  type Props = {
    success?: boolean
    title: string
  }
  const props = {
    success: [undefined, true],
    title: ['Title', 'Title2'],
  }
  const keys = getKeys<Props>(props)
  const perms = getPermutations<Props>(props, keys)
  const res = getFilenames(props, keys, perms)
  t.deepEquals(
    res,
    [
      'title=Title',
      'success_title=Title',
      'title=Title2',
      'success_title=Title2',
    ]
  )
})

test('Get Filename: idle case', async (t) => {
  type Props = {
    success?: boolean
  }
  const props = {
    success: [undefined, true],
  }
  const keys = getKeys<Props>(props)
  const perms = getPermutations<Props>(props, keys)
  const res = getFilenames(props, keys, perms)
  t.deepEquals(
    res,
    [
      '{idle}',
      'success',
    ]
  )
})
