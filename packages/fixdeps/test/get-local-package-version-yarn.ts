import test from 'blue-tape'
import { mock } from 'mocku'
import { createSpy, getSpyCalls } from 'spyfn'

test('fixdeps: getLocalPackageVersionYarn result', async (t) => {
  const spy = createSpy(() => ({
    stdout: ' pkg@1.0.0',
  }))

  const unmock = mock('../src/get-local-package-version-yarn', {
    execa: { default: spy },
  })

  const { getLocalPackageVersionYarn } = await import('../src/get-local-package-version-yarn')

  const result = await getLocalPackageVersionYarn('pkg')

  t.equals(
    result,
    '1.0.0',
    'should return version'
  )

  t.deepEquals(
    getSpyCalls(spy),
    [['yarn', ['list', '--pattern', 'pkg'], { stdout: null, stderr: null }]],
    'should call yarn with arguments'
  )

  unmock()
})

test('fixdeps: getLocalPackageVersionYarn more than one version', async (t) => {
  const spy = createSpy(() => ({
    stdout: ' pkg@1.0.0\n pkg@2.0.0',
  }))

  const unmock = mock('../src/get-local-package-version-yarn', {
    execa: { default: spy },
  })

  const { getLocalPackageVersionYarn } = await import('../src/get-local-package-version-yarn')

  try {
    await getLocalPackageVersionYarn('pkg')
    t.fail()
  } catch (e) {
    t.equals(
      e.message,
      'More than one version of "pkg" exists',
      'should throw error'
    )
  }

  unmock()
})

test('fixdeps: getLocalPackageVersionYarn no result', async (t) => {
  const spy = createSpy(() => ({
    stdout: '',
  }))

  const unmock = mock('../src/get-local-package-version-yarn', {
    execa: { default: spy },
  })

  const { getLocalPackageVersionYarn } = await import('../src/get-local-package-version-yarn')

  const result = await getLocalPackageVersionYarn('pkg')

  t.equals(
    result,
    null,
    'should return null'
  )

  unmock()
})
