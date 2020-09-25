/* eslint-disable node/no-sync */
import { mockFs } from '@mock/fs'
import { mockRequire } from '@mock/require'
import type { IFs } from 'memfs'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'

const mockFsRead = (fs: IFs) => {
  const origRead = fs.read

  // eslint-disable-next-line max-params
  fs.read = ((fd: number, buffer: Buffer | Uint8Array, offset: number, length: number, position: number, callback: (err?: Error | null, result?: {bytesRead?: number}) => void) => {
    return origRead(fd, buffer, offset, length, position, (err, bytesRead) => callback(err, { bytesRead }))
  }) as any
}

test('yupg: default', async (t) => {
  const filePath = `${process.cwd()}/yarn.lock`
  const spawnChildProcessSpy = createSpy(() => Promise.resolve())
  const { fs, unmockFs } = mockFs('../src')

  const unmockRequire = mockRequire('../src', {
    spown: {
      spawnChildProcess: spawnChildProcessSpy,
    },
  })

  try {
    mockFsRead(fs)
    fs.mkdirpSync(process.cwd())
    fs.writeFileSync(
      filePath,
      `
"before@^1.0.0":
  dependencies:
    pifs "^1.0.0"

"package@1.0.0":
  dependencies:
    escape-string-regexp "^2.0.0"

"after@^1.0.0":
  dependencies:
    pifs "^1.0.0"
`
    )

    const { upgradeDependency } = await import('../src')

    await upgradeDependency('package')

    t.equals(
      fs.readFileSync(filePath, 'utf8'),
      `
"before@^1.0.0":
  dependencies:
    pifs "^1.0.0"

"after@^1.0.0":
  dependencies:
    pifs "^1.0.0"
`,
      'should remove'
    )

    t.deepEquals(
      getSpyCalls(spawnChildProcessSpy),
      [
        ['yarn install --non-interactive', { stderr: process.stderr }],
      ],
      'should call yarn install'
    )
  } finally {
    unmockRequire()
    unmockFs()
  }
})
