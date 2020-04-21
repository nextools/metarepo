# @mock/request ![npm](https://flat.badgen.net/npm/v/@mock/request)

Mock HTTP(S) requests through redirecting to a temporary HTTP(S) server allowing to handle a request in whatever way.

## Install

```sh
$ yarn add --dev @mock/request
```

## Usage

```ts
const mockRequest: (file: string, callback: http.RequestListener) => () => void
```

```ts
// fetch-data.js
import fetch from 'node-fetch'

export const fetchData = async (): Promise<{ [key: string]: any }> => {
  const response = await fetch('https://api.thecatapi.com/v1/breeds')
  const data = await response.json()

  return data
}
```

```ts
import test from 'blue-tape'
import { mockRequest } from '@mock/request'

test('fetchData', async (t) => {
  const unmockRequest = mockRequest('./fetch-data', (req, res) => {
    if (req.url === 'https://api.thecatapi.com/v1/breeds' && req.method === 'GET') {
      res.end(JSON.stringify({ fake: true }))
    } else {
      t.fail('should not get here')
    }
  })

  const { fetchData } = await import('./fetch-data')
  const data = await fetchData()

  t.deepEqual(
    data,
    { fake: true },
    'should fetch data'
  )

  unmockRequest()
})
```
