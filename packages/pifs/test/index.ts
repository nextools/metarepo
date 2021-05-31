import test from 'tape'

test('pifs: exports aligned with v12', async (t) => {
  const originalFs = await import('fs')
  const pifs = await import('../src')
  let hasErrors = false

  for (const name of Object.keys(pifs)) {
    if (name !== 'default' && !Reflect.has(originalFs, name)) {
      hasErrors = true
      t.fail(`${name} doesn't exist`)
    }
  }

  for (const name of Object.keys(pifs.default)) {
    if (name !== 'default' && !Reflect.has(originalFs.default, name)) {
      hasErrors = true
      t.fail(`default.${name} doesn't exist`)
    }
  }

  if (!hasErrors) {
    t.pass('should align exported names')
  }
})
