import { mockRequire } from '@mock/require'
import { createSpy, getSpyCalls } from 'spyfn'
import test from 'tape'

test('fixdeps: getLocalPackageVersionYarn result', async (t) => {
  const spy = createSpy(() => ({
    stdout: JSON.stringify({
      type: 'tree',
      data: {
        type: 'list',
        trees: [
          {
            name: 'pkg@1.0.0',
            children: [],
            hint: null,
            color: null,
            depth: 0,
          },
        ],
      },
    }),
  }))

  const unmockRequire = mockRequire('../src/get-local-package-version-yarn', {
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
    [['yarn', ['list', '--json', '--depth=0', '--pattern', 'pkg'], { stderr: 'ignore' }]],
    'should call yarn with arguments'
  )

  unmockRequire()
})

test('fixdeps: getLocalPackageVersionYarn no result', async (t) => {
  const spy = createSpy(() => ({
    stdout: JSON.stringify({
      type: 'tree',
      data: {
        type: 'list',
        trees: [],
      },
    }),
  }))

  const unmockRequire = mockRequire('../src/get-local-package-version-yarn', {
    execa: { default: spy },
  })

  const { getLocalPackageVersionYarn } = await import('../src/get-local-package-version-yarn')

  const result = await getLocalPackageVersionYarn('pkg')

  t.equals(
    result,
    null,
    'should return null'
  )

  unmockRequire()
})

test('fixdeps: getLocalPackageVersionYarn no output', async (t) => {
  const spy = createSpy(() => ({
    stdout: '',
  }))

  const unmockRequire = mockRequire('../src/get-local-package-version-yarn', {
    execa: { default: spy },
  })

  const { getLocalPackageVersionYarn } = await import('../src/get-local-package-version-yarn')

  try {
    await getLocalPackageVersionYarn('pkg')

    t.fail('should not get here')
  } catch (e) {
    t.equals(
      e.message,
      'Unexpected end of JSON input',
      'should throw error'
    )
  }

  unmockRequire()
})
