# unchunk ![npm](https://flat.badgen.net/npm/v/unchunk)

Unchunk readable stream into Promise. Works with HTTP server requests, HTTP request responses or any other event emitters where `data` event receives `Buffer`-chunks and `end` means it's done.

## Install

```sh
$ yarn add unchunk
```

## Usage

```ts
const unchunkBuffer: (emitter: EventEmitter) => Promise<Buffer>
```

```ts
const unchunkString: (emitter: EventEmitter) => Promise<string>
```

```ts
type TAnyObject = {
  [key: string]: any
}

const unchunkJson: <T = TAnyObject>(emitter: EventEmitter) => Promise<T>
```

```ts
import http from 'http'
import { unchunkJson } from 'unchunk'

const server = http.createServer(async (req, res) => {
  const body = await unchunkJson(req)

  console.log(body)
  // { "ping": true }

  res.end(JSON.stringify({ pong: true }))
})

server.listen(3000, 'localhost')

const request = http.request('http://localhost:3000/', { method: 'POST' }, async (res) => {
  const body = await unchunkJson(res)

  console.log(body)
  // { "pong": true }
})

request.write(JSON.stringify({ ping: true }))
request.end()
```

```ts
import { Readable } from 'stream'
import { unchunkString } from 'unchunk'

let i = 0

const readable = new Readable({
  read() {
    if (i === 0) {
      this.push('he')
    } else if (i === 1) {
      this.push('l')
    } else {
      this.push('lo')
      this.push(null)
    }

    i++
  }
})

const result = await unchunkString(readable)

console.log(result)
// hello
```
