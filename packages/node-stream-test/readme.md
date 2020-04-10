# Node Stream Test

## Install
```
npm install node-stream-test
```

## Usage

### `readable`
creates test `Readable` stream, simulating `sync`/`async` behaviors
`(options: MakeReadableOptions) => (readableOptions: ReadableOptions) => (iterable: Iterable<any>) => Readable`
```ts
type MakeReadableOptions = {
  eager: boolean               // lazy or eager stream behavior
  log?: typeof console.log     // provide debug logger or noop
  delayMs?: number             // simulate async stream behavior
  errorAtStep?: number         // emit 'error' event at certain step
  continueOnError?: boolean    // whether should stream continue on error or break
}
```
> Lazy stream pushes one `chunk` of data on every `read`.  
Eager stream pushes all `chunks` in a synchronous loop on `read`.

> `delayMs` is a delay between `read` call and actual `chunk` push.  
This simulates asynchronous stream behavior.  
If the stream is `eager`, it will push all `chunks` in a loop after first delay
```ts
import { readable } from 'node-stream-test'

// create test-readable stream
const testReadable = readable({
  log: console.log,            // output debug info to console
  delayMs: 10,                 // delay 10ms
  eager: false                 // eager or lazy stream 
})({
  objectMode: true             // provide Node Readable configuration
})(
  [1, 2, 3, 4, 5]              // provide data to stream
)

// subscribe to test-readable
testReadable
  .on('data', () => {})
  .on('end', () => {})
```

### `writable`
creates test `Writable` stream, simulating `sync`/`async` behaviors
`(options: MakeWritableOptions) => (writableOptions: WritableOptions) => (sink: (chunk: any) => void) => Writable`
```ts
type MakeWritableOptions = {
  log: typeof console.log,       // provide debug logger or noop
  delayMs?: number               // simulate async
  errorAtStep?: number           // emit 'error' event at certain step
}
```
> `delayMs` is a delay between `write` call and passing `chunk` to a sink.  
This simulates long async writes.
```ts
import { writable } from 'node-stream-test'

// We have the following stream
declare var stream: ReadableStream

const testWritable = writable({ 
  log: console.log,              // output debug info to console
  delayMs: 10                    // delay 10ms
})({
  objectMode: true               // provide Node Writable configuration
})

// pipe the stream into test-writable
stream.pipe(
  stream,
  testWritable
).on('data', () => {})
  .on('end', () => {})
```

### `producer`
writes `chunks` to a stream
`(options: ProducerOptions) => (iterable: Iterable<any>) => (stream: WritableStream) => () => void`
```ts
type ProducerOptions = {
  log: typeof console.log,        // provide debug logger or noop
  eager: boolean                  // eager or lazy producer
}
```
> `eager` producer writes `chunks` in a synchronous loop until `highWatermark` reached.  
`lazy` producer writes one `chunk` on `drain` event.
```ts
import { producer } from 'node-stream-test'

// We have the following writable stream
declare var stream: WritableStream

// create a producer
const beginProduce = producer({
  log: console.log,                // output debug info to console
  eager: true                      // eager producer
})(
  [1, 2, 3, 4, 5],                 // data to write
  0                                // write all data
)(
  stream                           // write to this stream
)
```

### `push-consumer`
simple `on('data')` consumer with logging
`(options: DataConsumerOptions) => (sink: (chunk: any) => void) => (stream: ReadableStream) => () => void`
```ts
type PushConsumerOptions = {
  log: typeof console.log    // provide debug logger or noop
}
```
```ts
import { pushConsumer } from 'node-stream-test'

// We have the following stream
declare var stream: ReadableStream

pushConsumer({ 
  log: console.log           // output debug info to console
})(
  (chunk: string) => {}      // your callback on every `data` event
)(
  stream,                    // stream to consume
)
```

### `pull-consumer`
simple `on('readable')` consumer with `sync/async` behavior and logging
`(options: ReadableConsumerOptions) => (sink: (chunk: any) => void) => (stream: ReadableStream) => () => void`
```ts
type PullConsumerOptions = {
  log: typeof console.log,       // provide debug logger or noop
  delayMs?: number,              // simulate async
  eager?: boolean,               // eager or lazy behavior
  readSize?: number              // how much data to read on each 'readable' event
}
```
> `delayMs` is a time between `readable` event and actual `read` call on stream.
  
> `eager` consumer calls `read` in synchronous loop until `null` returned.  
Then waits for the next `readable`.  
`lazy` consumer reads one `chunk`, then waits.
```ts
import { pullConsumer } from 'node-stream-test'

// We have the following stream
declare var stream: ReadableStream

pullConsumer({
  log: console.log,                // print debug info to console
  delayMs: 10,                     // delay 10ms
  eager: false,                    // lazy behavior
  readSize: undefined              // read all available data
})(
  (chunk: string) => {}            // your callback on `read` call, after `readable` event
)(
  stream,                          // stream to consume
)
```
