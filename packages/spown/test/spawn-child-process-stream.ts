import { EventEmitter } from 'events'
import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'
import { unchunkString } from 'unchunk'
import { mockChildProcess } from './helpers'

test('spown: spawnChildProcessStream + ok + stdout + stderr', async (t) => {
  const childProcess = mockChildProcess({
    stdout: 'output',
    stderr: 'oops',
    exitCode: null,
  })

  childProcess.kill = () => {}

  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: () => childProcess,
    },
    'signal-exit': {
      default: () => {},
    },
  })
  const { spawnChildProcessStream } = await import('../src')
  const result = spawnChildProcessStream('foo')

  const [stdout, stderr] = await Promise.all([
    result.stdout !== null ? unchunkString(result.stdout) : null,
    result.stderr !== null ? unchunkString(result.stderr) : null,
  ])

  t.equal(
    stdout,
    'output',
    'should provide stdout'
  )

  t.equal(
    stderr,
    'oops',
    'should provide stderr'
  )

  unmockRequire()
})

test('spown: spawnChildProcessStream + command + default options', async (t) => {
  const emitter = new EventEmitter()
  const spy = createSpy(() => {
    return emitter
  })

  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: spy,
    },
    'signal-exit': {
      default: () => {},
    },
  })
  const { spawnChildProcessStream } = await import('../src')

  spawnChildProcessStream('foo -a b -b "c d" -c d\\ e -d "e f g"')

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

test('spown: spawnChildProcessStream + custom options', async (t) => {
  const emitter = new EventEmitter()
  const spy = createSpy(() => {
    return emitter
  })

  const unmockRequire = mockRequire('../src', {
    'cross-spawn': {
      default: spy,
    },
    'signal-exit': {
      default: () => {},
    },
  })
  const { spawnChildProcessStream } = await import('../src')

  spawnChildProcessStream('foo -a b -b "c d" -c d\\ e -d "e f g"', {
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
    shouldCreateIpcChannel: true,
  })

  t.deepEqual(
    getSpyCalls(spy),
    [
      [
        'foo',
        ['-a', 'b', '-b', 'c d', '-c', 'd\\ e', '-d', 'e f g'],
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
          stdio: ['ignore', 'ignore', 'ignore', 'ipc'],
        },
      ],
    ],
    'should work'
  )

  unmockRequire()
})

test('spown: spawnChildProcessStream + onExitHook + null signal + kill', async (t) => {
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

  const { spawnChildProcessStream } = await import('../src')

  spawnChildProcessStream('foo')

  t.deepEqual(
    getSpyCalls(killSpy),
    [[]],
    'should work'
  )

  unmockRequire()
})

test('spown: spawnChildProcessStream + onExitHook + signal + kill', async (t) => {
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

  const { spawnChildProcessStream } = await import('../src')

  spawnChildProcessStream('foo')

  t.deepEqual(
    getSpyCalls(killSpy),
    [[42]],
    'should work'
  )

  unmockRequire()
})

test('spown: spawnChildProcessTest + onExitHook + multiple processes + kill', async (t) => {
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

  const { spawnChildProcessStream } = await import('../src')

  spawnChildProcessStream('foo')
  spawnChildProcessStream('bar')

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

test('spown: spawnChildProcessStream + onExitHook + multiple processes + nothing to kill', async (t) => {
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

  const { spawnChildProcessStream } = await import('../src')

  spawnChildProcessStream('foo')
  spawnChildProcessStream('bar')

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
