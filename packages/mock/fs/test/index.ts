/* eslint-disable node/no-sync */
import path from 'path'
import test from 'tape'
import { mockFs } from '../src'

test('mocku-fs: mockFs + relative target file path', async (t) => {
  const fixturePath = require.resolve('./fixtures/data.txt')
  const { fs, unmockFs } = mockFs('./fixtures/')

  fs.mkdirSync(path.dirname(fixturePath), { recursive: true })
  fs.writeFileSync(fixturePath, 'fake data\n')

  const imported1 = await import('./fixtures')

  t.equal(
    await imported1.getData(),
    'fake data\n',
    'should mock'
  )

  unmockFs()

  const imported2 = await import('./fixtures')

  t.equal(
    await imported2.getData(),
    'real data\n',
    'should unmock'
  )
})

test('mocku-fs: mockFs + absolute target file path', async (t) => {
  const fixturePath = require.resolve('./fixtures/data.txt')
  const { fs, unmockFs } = mockFs(require.resolve('./fixtures/'))

  fs.mkdirSync(path.dirname(fixturePath), { recursive: true })
  fs.writeFileSync(fixturePath, 'fake data\n')

  const imported1 = await import('./fixtures')

  t.equal(
    await imported1.getData(),
    'fake data\n',
    'should mock'
  )

  unmockFs()

  const imported2 = await import('./fixtures')

  t.equal(
    await imported2.getData(),
    'real data\n',
    'should unmock'
  )
})
