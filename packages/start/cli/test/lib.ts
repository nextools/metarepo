import path from 'path'
import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'

test('cli: export', async (t) => {
  const { default: cliLib } = await import('../src/lib')

  t.equals(
    typeof cliLib,
    'function',
    'must be a function'
  )
})

test('cli: throw without reporter', async (t) => {
  const { default: cliLib } = await import('../src/lib')

  const argv = [] as string[]
  const options = {}

  return cliLib(argv, options).catch((error) => {
    t.equals(
      error,
      '`reporter` option is missing in your `package.json` → `start`',
      'should throw'
    )
  })
})

test('cli: throw without task name', async (t) => {
  const unmockImport = mockRequire('../src/lib', {
    './fixtures/preset': {
      a: 1,
      b: 2,
    },
  })

  const { default: cliLib } = await import('../src/lib')

  const argv = ['foo', 'bar']
  const options = {
    preset: '../test/fixtures/preset',
    reporter: '../test/fixtures/reporter',
  }

  return cliLib(argv, options).catch((error) => {
    t.equals(
      error,
      'One of the following task names is required:\n* a\n* b',
      'should throw'
    )

    unmockImport()
  })
})

test('cli: throw with unknown task name', async (t) => {
  const unmockImport = mockRequire('../src/lib', {
    './fixtures/preset': {
      a: 1,
      b: 2,
    },
  })

  const { default: cliLib } = await import('../src/lib')

  const argv = ['foo', 'bar', 'c']
  const options = {
    preset: '../test/fixtures/preset',
    reporter: '../test/fixtures/reporter',
  }

  return cliLib(argv, options).catch((error) => {
    t.equals(
      error,
      'One of the following task names is required:\n* a\n* b',
      'should throw'
    )

    unmockImport()
  })
})

test('cli: default file', async (t) => {
  const taskRunnerSpy = createSpy(() => () => {})
  const taskSpy = createSpy(() => taskRunnerSpy)
  const reporterSpy = createSpy(() => 'reporter')

  const unmockImport = mockRequire('../src/lib', {
    [path.resolve('./tasks')]: {
      task: taskSpy,
    },
    './fixtures/reporter': {
      default: reporterSpy,
    },
  })

  const { default: cliLib } = await import('../src/lib')

  const argv = ['foo', 'bar', 'task', 'arg1', 'arg2']
  const options = {
    reporter: '../test/fixtures/reporter',
  }

  await cliLib(argv, options)

  t.deepEquals(
    getSpyCalls(taskSpy),
    [['arg1', 'arg2']],
    'should call task with args'
  )

  t.deepEquals(
    getSpyCalls(taskRunnerSpy),
    [['reporter']],
    'should call taskRunner with props'
  )

  t.deepEquals(
    getSpyCalls(reporterSpy),
    [['task']],
    'should call reporter with task name'
  )

  unmockImport()
})

test('cli: custom file', async (t) => {
  const taskRunnerSpy = createSpy(() => () => {})
  const taskSpy = createSpy(() => taskRunnerSpy)
  const reporterSpy = createSpy(() => 'reporter')

  const unmockImport = mockRequire('../src/lib', {
    './fixtures/tasks': {
      task: taskSpy,
    },
    './fixtures/reporter': {
      default: reporterSpy,
    },
  })

  const { default: cliLib } = await import('../src/lib')

  const argv = ['foo', 'bar', 'task', 'arg1', 'arg2']
  const options = {
    file: path.relative(process.cwd(), require.resolve('./fixtures/tasks')),
    reporter: '../test/fixtures/reporter',
  }

  await cliLib(argv, options)

  t.deepEquals(
    getSpyCalls(taskSpy),
    [['arg1', 'arg2']],
    'should call task with args'
  )

  t.deepEquals(
    getSpyCalls(taskRunnerSpy),
    [['reporter']],
    'should call taskRunner with props'
  )

  t.deepEquals(
    getSpyCalls(reporterSpy),
    [['task']],
    'should call reporter with task name'
  )

  unmockImport()
})

test('cli: preset', async (t) => {
  const taskRunnerSpy = createSpy(() => () => {})
  const taskSpy = createSpy(() => taskRunnerSpy)
  const reporterSpy = createSpy(() => 'reporter')

  const unmockImport = mockRequire('../src/lib', {
    './fixtures/preset': {
      task: taskSpy,
    },
    './fixtures/reporter': {
      default: reporterSpy,
    },
  })

  const { default: cliLib } = await import('../src/lib')

  const argv = ['foo', 'bar', 'task', 'arg1', 'arg2']
  const options = {
    preset: '../test/fixtures/preset',
    reporter: '../test/fixtures/reporter',
  }

  await cliLib(argv, options)

  t.deepEquals(
    getSpyCalls(taskSpy),
    [['arg1', 'arg2']],
    'should call task with args'
  )

  t.deepEquals(
    getSpyCalls(taskRunnerSpy),
    [['reporter']],
    'should call taskRunner with props'
  )

  t.deepEquals(
    getSpyCalls(reporterSpy),
    [['task']],
    'should call reporter with task name'
  )

  unmockImport()
})
