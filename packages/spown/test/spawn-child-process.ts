import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { createReadable, mockChildProcess } from './helpers'

test('spown: spawnChildProcess + slow close + ok + stdout + stderr', async (t) => {
  const childProcess = mockChildProcess({
    stdout: 'output     \r\n',
    stderr: 'oops\n\n\n',
    exitCode: null,
  })
  let isClosed = false

  childProcess.kill = () => {}

  childProcess.once = (e: string, callback: (data?: any) => void) => {
    if (!isClosed && e === 'close') {
      isClosed = true

      callback(0)
    }

    return childProcess
  }

  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: () => childProcess,
    },
    'signal-exit': {
      default: () => {},
    },
  })
  const { spawnChildProcess } = await import('../src')
  const result = await spawnChildProcess('foo')

  t.deepEqual(
    result,
    {
      stdout: 'output',
      stderr: 'oops',
    },
    'should work'
  )

  unmockRequire()
})

test('spown: spawnChildProcess + slow close + ok + no stdout + no stderr', async (t) => {
  const childProcess = mockChildProcess({
    stdout: null,
    stderr: null,
    exitCode: null,
  })
  let isClosed = false

  childProcess.kill = () => {}

  childProcess.once = (e: string, callback: (data?: any) => void) => {
    if (!isClosed && e === 'close') {
      isClosed = true

      callback(0)
    }

    return childProcess
  }

  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: () => childProcess,
    },
    'signal-exit': {
      default: () => {},
    },
  })
  const { spawnChildProcess } = await import('../src')
  const result = await spawnChildProcess('foo')

  t.deepEqual(
    result,
    { stdout: null, stderr: null },
    'should work'
  )

  unmockRequire()
})

test('spown: spawnChildProcess + slow close + error + stderr', async (t) => {
  const childProcess = mockChildProcess({
    stdout: 'output',
    stderr: 'oops',
    exitCode: null,
  })
  let isClosed = false

  childProcess.kill = () => {}

  childProcess.once = (e: string, callback: (data?: any) => void) => {
    if (!isClosed && e === 'close') {
      isClosed = true

      callback(42)
    }

    return childProcess
  }

  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: () => childProcess,
    },
    'signal-exit': {
      default: () => {},
    },
  })
  const { spawnChildProcess } = await import('../src')

  try {
    await spawnChildProcess('foo')

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'oops',
      'should throw with `stdout` as error message'
    )

    t.equal(
      e.exitCode,
      42,
      'should assign exit code to error object'
    )

    t.equal(
      e.stack,
      undefined,
      'should not provide stack trace'
    )
  }

  unmockRequire()
})

test('spown: spawnChildProcess + slow close + error + empty stderr', async (t) => {
  const childProcess = mockChildProcess({
    stdout: 'output',
    stderr: '',
    exitCode: null,
  })
  let isClosed = false

  childProcess.kill = () => {}

  childProcess.once = (e: string, callback: (data?: any) => void) => {
    if (!isClosed && e === 'close') {
      isClosed = true

      callback(42)

      return childProcess
    }

    return childProcess
  }

  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: () => childProcess,
    },
    'signal-exit': {
      default: () => {},
    },
  })
  const { spawnChildProcess } = await import('../src')

  try {
    await spawnChildProcess('foo')

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Child process exited with code 42',
      'should throw with default error message'
    )

    t.equal(
      e.exitCode,
      42,
      'should assign exit code to error object'
    )

    t.equal(
      e.stack,
      undefined,
      'should not provide stack trace'
    )
  }

  unmockRequire()
})

test('spown: spawnChildProcess + slow close + error + no stderr', async (t) => {
  const childProcess = mockChildProcess({
    stdout: null,
    stderr: null,
    exitCode: null,
  })
  let isClosed = false

  childProcess.kill = () => {}

  childProcess.once = (e: string, callback: (data?: any) => void) => {
    if (!isClosed && e === 'close') {
      isClosed = true

      callback(42)

      return childProcess
    }

    return childProcess
  }

  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: () => childProcess,
    },
    'signal-exit': {
      default: () => {},
    },
  })
  const { spawnChildProcess } = await import('../src')

  try {
    await spawnChildProcess('foo')

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Child process exited with code 42',
      'should throw with default error message'
    )

    t.equal(
      e.exitCode,
      42,
      'should assign exit code to error object'
    )

    t.equal(
      e.stack,
      undefined,
      'should not provide stack trace'
    )
  }

  unmockRequire()
})

test('spown: spawnChildProcess + slow close + hard error', async (t) => {
  const childProcess = mockChildProcess({
    stdout: null,
    stderr: null,
    exitCode: null,
  })
  let isClosed = false

  childProcess.kill = () => {}

  childProcess.once = (e: string, callback: (data?: any) => void) => {
    if (!isClosed && e === 'error') {
      isClosed = true

      callback(new Error('oops'))

      return childProcess
    }

    return childProcess
  }

  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: () => childProcess,
    },
    'signal-exit': {
      default: () => {},
    },
  })
  const { spawnChildProcess } = await import('../src')

  try {
    await spawnChildProcess('foo')

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'oops',
      'should throw error'
    )
  }

  unmockRequire()
})

test('spown: spawnChildProcess + fast close + ok + stdout + stderr', async (t) => {
  const stdout = createReadable('output     \r\n')
  const stderr = createReadable('oops\n\n')

  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: () => ({
        exitCode: 0,
        stdout,
        stderr,
      }),
    },
    'signal-exit': {
      default: () => {},
    },
  })

  const { spawnChildProcess } = await import('../src')
  const result = await spawnChildProcess('foo')

  t.deepEqual(
    result,
    { stdout: 'output', stderr: 'oops' },
    'should work'
  )

  unmockRequire()
})

test('spown: spawnChildProcess + fast close + ok + no stdout + no stderr', async (t) => {
  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: () => ({
        exitCode: 0,
        stdout: null,
        stderr: null,
      }),
    },
    'signal-exit': {
      default: () => {},
    },
  })

  const { spawnChildProcess } = await import('../src')
  const result = await spawnChildProcess('foo')

  t.deepEqual(
    result,
    { stdout: null, stderr: null },
    'should work'
  )

  unmockRequire()
})

test('spown: spawnChildProcess + fast close + error + stderr', async (t) => {
  const stdout = createReadable('output')
  const stderr = createReadable('oops')

  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: () => ({
        exitCode: 42,
        stdout,
        stderr,
      }),
    },
    'signal-exit': {
      default: () => {},
    },
  })

  const { spawnChildProcess } = await import('../src')

  try {
    await spawnChildProcess('foo')

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'oops',
      'should throw with `stdout` as error message'
    )

    t.equal(
      e.exitCode,
      42,
      'should assign exit code to error object'
    )

    t.equal(
      e.stack,
      undefined,
      'should not provide stack trace'
    )
  }

  unmockRequire()
})

test('spown: spawnChildProcess + fast close + error + empty stderr', async (t) => {
  const stdout = createReadable('output')
  const stderr = createReadable('')

  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: () => ({
        exitCode: 42,
        stdout,
        stderr,
      }),
    },
    'signal-exit': {
      default: () => {},
    },
  })

  const { spawnChildProcess } = await import('../src')

  try {
    await spawnChildProcess('foo')

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Child process exited with code 42',
      'should throw with default error message'
    )

    t.equal(
      e.exitCode,
      42,
      'should assign exit code to error object'
    )

    t.equal(
      e.stack,
      undefined,
      'should not provide stack trace'
    )
  }

  unmockRequire()
})

test('spown: spawnChildProcess + fast close + error + no stderr', async (t) => {
  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: () => ({
        exitCode: 42,
        stdout: null,
        stderr: null,
      }),
    },
    'signal-exit': {
      default: () => {},
    },
  })

  const { spawnChildProcess } = await import('../src')

  try {
    await spawnChildProcess('foo')

    t.fail('should not get here')
  } catch (e) {
    t.equal(
      e.message,
      'Child process exited with code 42',
      'should throw with default error message'
    )

    t.equal(
      e.exitCode,
      42,
      'should assign exit code to error object'
    )

    t.equal(
      e.stack,
      undefined,
      'should not provide stack trace'
    )
  }

  unmockRequire()
})

test('spown: spawnChildProcess + onExitHook + null signal + kill', async (t) => {
  const childProcess = mockChildProcess({
    stdout: null,
    stderr: null,
    exitCode: null,
  })
  let isClosed = false
  let onExitCallback: (signal: number | null) => void
  const killSpy = createSpy(() => {})

  childProcess.kill = killSpy

  childProcess.once = (e: string, callback: (data?: any) => void) => {
    if (!isClosed && e === 'close') {
      isClosed = true

      onExitCallback(null)
      callback(0)
    }

    return childProcess
  }

  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: () => childProcess,
    },
    'signal-exit': {
      default: (callback: (signal: number | null) => void) => {
        onExitCallback = callback
      },
    },
  })

  const { spawnChildProcess } = await import('../src')

  await spawnChildProcess('foo')

  t.deepEqual(
    getSpyCalls(killSpy),
    [[]],
    'should work'
  )

  unmockRequire()
})

test('spown: spawnChildProcess + onExitHook + signal + kill', async (t) => {
  const childProcess = mockChildProcess({
    stdout: null,
    stderr: null,
    exitCode: null,
  })
  let isClosed = false
  let onExitCallback: (signal: number | null) => void
  const killSpy = createSpy(() => {})

  childProcess.kill = killSpy

  childProcess.once = (e: string, callback: (data?: any) => void) => {
    if (!isClosed && e === 'close') {
      isClosed = true

      onExitCallback(42)
      callback(0)
    }

    return childProcess
  }

  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: () => childProcess,
    },
    'signal-exit': {
      default: (callback: (signal: number | null) => void) => {
        onExitCallback = callback
      },
    },
  })

  const { spawnChildProcess } = await import('../src')

  await spawnChildProcess('foo')

  t.deepEqual(
    getSpyCalls(killSpy),
    [[42]],
    'should work'
  )

  unmockRequire()
})

test('spown: spawnChildProcess + onExitHook + multiple processes + kill', async (t) => {
  let onExitCallback: (signal: number | null) => void
  const killSpies = new Set<any>()

  const ChildProcess = () => {
    const childProcess = mockChildProcess({
      stdout: null,
      stderr: null,
      exitCode: null,
    })
    let isClosed = false
    const killSpy = createSpy(() => {})

    killSpies.add(killSpy)

    childProcess.kill = killSpy

    childProcess.once = (e: string, callback: (data?: any) => void) => {
      if (!isClosed && e === 'close') {
        isClosed = true

        onExitCallback(42)
        callback(0)
      }

      return childProcess
    }

    return childProcess
  }

  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: ChildProcess,
    },
    'signal-exit': {
      default: (callback: (signal: number | null) => void) => {
        onExitCallback = callback
      },
    },
  })

  const { spawnChildProcess } = await import('../src')

  await spawnChildProcess('foo')
  await spawnChildProcess('bar')

  const result = Array.from(killSpies).map((spy) => getSpyCalls(spy))

  t.deepEqual(
    result,
    [
      [[42]],
      [[42]],
    ],
    'should work'
  )

  unmockRequire()
})

test('spown: spawnChildProcess + onExitHook + multiple processes + nothing to kill', async (t) => {
  let onExitCallback: (signal: number | null) => void
  const killSpies = new Set<any>()

  const ChildProcess = () => {
    const childProcess = mockChildProcess({
      stdout: null,
      stderr: null,
      exitCode: null,
    })
    let isClosed = false
    const killSpy = createSpy(() => {})

    killSpies.add(killSpy)

    childProcess.kill = killSpy

    childProcess.once = (e: string, callback: (data?: any) => void) => {
      if (!isClosed && e === 'close') {
        isClosed = true

        callback(0)
        onExitCallback(42)
      }

      return childProcess
    }

    return childProcess
  }

  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: ChildProcess,
    },
    'signal-exit': {
      default: (callback: (signal: number | null) => void) => {
        onExitCallback = callback
      },
    },
  })

  const { spawnChildProcess } = await import('../src')

  await spawnChildProcess('foo')
  await spawnChildProcess('bar')

  const result = Array.from(killSpies).map((spy) => getSpyCalls(spy))

  t.deepEqual(
    result,
    [
      [],
      [],
    ],
    'should work'
  )

  unmockRequire()
})

test('spown: spawnChildProcess + command + default options', async (t) => {
  const spy = createSpy(() => ({
    exitCode: 0,
    stdout: null,
    stderr: null,
  }))
  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: spy,
    },
    'signal-exit': {
      default: () => {},
    },
  })

  const { spawnChildProcess } = await import('../src')

  await spawnChildProcess('foo -a b -b "c d" -c d\\ e -d "e f g"')

  t.deepEqual(
    getSpyCalls(spy),
    [
      [
        'foo',
        ['-a', 'b', '-b', 'c d', '-c', 'd\\ e', '-d', 'e f g'],
        {
          argv0: undefined,
          cwd: undefined,
          env: { ...process.env },
          gid: undefined,
          uid: undefined,
          serialization: undefined,
          stdio: ['pipe', 'pipe', 'pipe', 'ignore'],
        },
      ],
    ],
    'should work'
  )

  unmockRequire()
})

test('spown: spawnChildProcess + custom options', async (t) => {
  const spy = createSpy(() => ({
    exitCode: 0,
    stdout: null,
    stderr: null,
  }))
  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: spy,
    },
    'signal-exit': {
      default: () => {},
    },
  })

  const { spawnChildProcess } = await import('../src')

  await spawnChildProcess('foo', {
    argv0: 'argv0',
    cwd: 'cwd',
    env: {
      foo: 'bar',
    },
    gid: 123,
    uid: 456,
    serialization: 'advanced',
    stdin: null,
    stdout: null,
    stderr: null,
  })

  t.deepEqual(
    getSpyCalls(spy),
    [
      [
        'foo',
        [],
        {
          argv0: 'argv0',
          cwd: 'cwd',
          env: {
            ...process.env,
            foo: 'bar',
          },
          gid: 123,
          uid: 456,
          serialization: 'advanced',
          stdio: ['ignore', 'ignore', 'ignore', 'ignore'],
        },
      ],
    ],
    'should work'
  )

  unmockRequire()
})
