import test from 'blue-tape'
import { mock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'

test('fixdeps: getRemotePackageVersionNpm result', async (t) => {
  const spy = createSpy(() => ({
    stdout: '1.0.0',
  }))

  const unmock = mock('../src/get-remote-package-version-npm', {
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
    [['npm', ['info', 'pkg', 'version'], { stdout: null, stderr: null }]],
    'should call npm with arguments'
  )

  unmock()
})

test('fixdeps: getRemotePackageVersionNpm no result', async (t) => {
  const spy = createSpy(() => ({
    stdout: '',
  }))

  const unmock = mock('../src/get-remote-package-version-npm', {
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

  unmock()
})
