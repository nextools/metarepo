import test from 'tape'
import makethen from '../src'

test('error', async (t) => {
  const callback = (cb: (err: any) => void) => cb(new Error('foo'))

  try {
    await makethen(callback)()
    t.fail('should never happen')
  } catch (error) {
    t.equal(
      error.message,
      'foo',
      'should reject with error message'
    )
  }
})

test('no arguments + no result', async (t) => {
  const callback = (cb: (err: any) => void) => cb(null)
  const result: void = await makethen(callback)()

  t.equal(
    typeof result,
    'undefined',
    'should resolve with no result'
  )
})

test('no arguments + 1 result', async (t) => {
  const callback = (cb: (err: any, res: number) => void) => cb(null, 123)
  const result: number = await makethen(callback)()

  t.equal(
    result,
    123,
    'should resolve with result'
  )
})

test('no arguments + 2 results', async (t) => {
  const callback = (cb: (err: any, res1: number, res2: boolean) => void) => cb(null, 123, true)
  const result: [number, boolean] = await makethen(callback)()

  t.deepEqual(
    result,
    [123, true],
    'should resolve with array of results'
  )
})

test('no arguments + 3 results', async (t) => {
  const callback = (cb: (err: any, res1: number, res2: boolean, res3: string) => void) => cb(null, 123, true, 'foo')
  const result: [number, boolean, string] = await makethen(callback)()

  t.deepEqual(
    result,
    [123, true, 'foo'],
    'should resolve with array of results'
  )
})

test('1 argument + no result', async (t) => {
  const callback = (arg: number, cb: (err: any) => void) => cb(null)
  const result: void = await makethen(callback)(123)

  t.equal(
    typeof result,
    'undefined',
    'should resolve with no result'
  )
})

test('1 argument + 1 result', async (t) => {
  const callback = (arg: number, cb: (err: any, res: number) => void) => cb(null, arg)
  const result: number = await makethen(callback)(123)

  t.equal(
    result,
    123,
    'should resolve with result'
  )
})

test('1 argument + 2 results', async (t) => {
  const callback = (arg: number, cb: (err: any, res1: number, res2: boolean) => void) => cb(null, arg, true)
  const result: [number, boolean] = await makethen(callback)(123)

  t.deepEqual(
    result,
    [123, true],
    'should resolve with array of results'
  )
})

test('1 argument + 3 results', async (t) => {
  const callback = (arg: number, cb: (err: any, res1: number, res2: boolean, res3: string) => void) => cb(null, arg, true, 'foo')
  const result: [number, boolean, string] = await makethen(callback)(123)

  t.deepEqual(
    result,
    [123, true, 'foo'],
    'should resolve with array of results'
  )
})

test('2 arguments + no result', async (t) => {
  const callback = (arg1: number, arg2: boolean, cb: (err: any) => void) => cb(null)
  const result: void = await makethen(callback)(123, true)

  t.equal(
    typeof result,
    'undefined',
    'should resolve with no result'
  )
})

test('2 arguments + 1 result', async (t) => {
  const callback = (arg1: number, arg2: boolean, cb: (err: any, res: number) => void) => cb(null, arg1)
  const result: number = await makethen(callback)(123, true)

  t.equal(
    result,
    123,
    'should resolve with result'
  )
})

test('2 arguments + 2 results', async (t) => {
  const callback = (arg1: number, arg2: boolean, cb: (err: any, res1: number, res2: boolean) => void) => cb(null, arg1, arg2)
  const result: [number, boolean] = await makethen(callback)(123, true)

  t.deepEqual(
    result,
    [123, true],
    'should resolve with array of results'
  )
})

test('2 arguments + 3 results', async (t) => {
  const callback = (arg1: number, arg2: boolean, cb: (err: any, res1: number, res2: boolean, res3: string) => void) => cb(null, arg1, arg2, 'foo')
  const result: [number, boolean, string] = await makethen(callback)(123, true)

  t.deepEqual(
    result,
    [123, true, 'foo'],
    'should resolve with array of results'
  )
})

test('3 arguments + no result', async (t) => {
  const callback = (arg1: number, arg2: boolean, arg3: string, cb: (err: any) => void) => cb(null)
  const result: void = await makethen(callback)(123, true, 'foo')

  t.equal(
    typeof result,
    'undefined',
    'should resolve with no result'
  )
})

test('3 arguments + 1 result', async (t) => {
  const callback = (arg1: number, arg2: boolean, arg3: string, cb: (err: any, res: number) => void) => cb(null, arg1)
  const result: number = await makethen(callback)(123, true, 'foo')

  t.equal(
    result,
    123,
    'should resolve with result'
  )
})

test('3 arguments + 2 results', async (t) => {
  const callback = (arg1: number, arg2: boolean, arg3: string, cb: (err: any, res1: number, res2: boolean) => void) => cb(null, arg1, arg2)
  const result: [number, boolean] = await makethen(callback)(123, true, 'foo')

  t.deepEqual(
    result,
    [123, true],
    'should resolve with array of results'
  )
})

test('3 arguments + 3 results', async (t) => {
  const callback = (arg1: number, arg2: boolean, arg3: string, cb: (err: any, res1: number, res2: boolean, res3: string) => void) => cb(null, arg1, arg2, arg3)
  const result: [number, boolean, string] = await makethen(callback)(123, true, 'foo')

  t.deepEqual(
    result,
    [123, true, 'foo'],
    'should resolve with array of results'
  )
})
