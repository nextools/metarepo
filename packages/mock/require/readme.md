# @mock/require

Mock `require`, doesn't currently work with real `--experimental-modules` ESM.

## Install

```sh
$ yarn add --dev @mock/require
```

## Usage

```ts
type TMocks = {
  [key: string]: any
}

const mockRequire: (file: string, mocks: TMocks) => () => void
```

```ts
// text.ts
export default 'cpus'
```

```ts
// get-data.ts
import text from './text'
import { cpus } from 'os'

export const getData = () => `${cpus().length} ${text}`
```

```ts
import test from 'blue-tape'
import { mockRequire } from '@mock/import'

test('getData', async (t) => {
  const unmockRequire = mockRequire('./get-data', {
    './text': {
      default: 'cpus!!!'
    },
    os: {
      cpus: () => new Array(100)
    }
  })

  const { getData } = await import('./get-data')
  const data = await geteData()

  t.equal(
    data,
    '100 cpus!!!',
    'should get data'
  )

  unmockRequire()
})
```
