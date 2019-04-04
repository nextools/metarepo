import test from 'blue-tape'
import { PropsWithValues } from '../src/types'
import { getKeys } from '../src/get-keys'

test('Get Keys: should work', async (t) => {
  type Props = {
    success?: boolean
    title: string
  }
  const props: PropsWithValues<Props> = {
    success: [undefined, true],
    title: ['Title'],
  }
  const keys = getKeys(props)
  t.deepEquals(
    keys,
    ['success', 'title']
  )
})
