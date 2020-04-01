# @mock/global

Mock global scope and `global` object.

## Install

```sh
$ yarn add --dev @mock/global
```

## Usage

```ts
type TMocks = {
    [key: string]: any
}

const mockGlobal: (file: string, mocks: TMocks) => () => void
```

```ts
// wait-for-5-min.ts
export const waitFor5Min = (): Promise<void> => new Promise((resolve) => {
  setTimeout(resolve, 5 * 60 * 1000)
})
```

```ts
import test from 'blue-tape'
import { mockGlobal } from '@mock/global'

test('waitFor30Sec', (t) => {
  const unmockGlobal = mockGlobal('./wait-for-30-sec', {
    setTimeout: (callback: () => void, delay: number) => {
      t.equal(
        delay,
        5 * 60 * 1000,
        'should wait for 5 min'
      )

      callback()
    }
  })

  const { waitFor5Min } = await import('./wait-for-30-sec')

  await waitFor5Min()

  unmockGlobal()
})
```
