# @mock/fs ![npm](https://flat.badgen.net/npm/v/@mock/fs)

Mock FS in-memory using [memfs](https://github.com/streamich/memfs).

## Install

```sh
$ yarn add --dev @mock/fs
```

## Usage

```ts
const mockFs: (file: string) => () => void
```

```ts
// get-data.js
import { promises } from 'fs'

export const getData = (): Promise<string> => promises.readFile('./data.txt', 'utf8')
```

```ts
import test from 'blue-tape'
import { mockFs } from '@mock/fs'

test('getData', async (t) => {
  const { fs, unmockFs } = mockFs('./get-data')

  fs.writeFileSync('./data.txt', 'fake data')

  const { getData } = await import('./get-data')
  const data = await getData()

  t.equal(
    data,
    'fake data',
    'should get data'
  )

  unmockFs()
})
```
