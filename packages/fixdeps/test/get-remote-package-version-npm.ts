import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'

test('fixdeps: getRemotePackageVersionNpm result', async (t) => {
  const spy = createSpy(() => ({
    stdout: '1.0.0',
  }))

  const unmockRequire = mockRequire('../src/get-remote-package-version-npm', {
    execa: { default: spy },
  })

  const { getRemotePackageVersionNpm } = await import('../src/get-remote-package-version-npm')

  const result = await getRemotePackageVersionNpm('pkg')

  t.equals(
    result,
    '1.0.0',
    'should return version'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [['npm', ['info', 'pkg', 'version'], { stdout: 'ignore', stderr: 'ignore' }]],
    'should call npm with arguments'
  )

  unmockRequire()
})

test('fixdeps: getRemotePackageVersionNpm no result', async (t) => {
  const spy = createSpy(() => ({
    stdout: '',
  }))

  const unmockRequire = mockRequire('../src/get-remote-package-version-npm', {
    execa: { default: spy },
  })

  const { getRemotePackageVersionNpm } = await import('../src/get-remote-package-version-npm')

  try {
    await getRemotePackageVersionNpm('pkg')
    t.fail()
  } catch (e) {
    t.equals(
      e.message,
      'Cannot find package "pkg"',
      'should throw error'
    )
  }

  unmockRequire()
})
