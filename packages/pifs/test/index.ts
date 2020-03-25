import test from 'tape'

if (process.version.startsWith('v12')) {
  test('pifs: exports aligned with v10', async (t) => {
    const originalFs = await import('fs')
    const pifs = await import('../src')
    let hasErrors = false

    for (const name of Object.keys(pifs)) {
      if (name !== 'default' && !Reflect.has(originalFs, name)) {
        hasErrors = true
        t.fail(`${name} doesn't exist in Node v12`)
      }
    }

    for (const name of Object.keys(pifs.default)) {
      if (name !== 'default' && !Reflect.has(originalFs.default, name)) {
        hasErrors = true
        t.fail(`default.${name} doesn't exist in Node v12`)
      }
    }

    if (!hasErrors) {
      t.pass('should align exported names')
    }
  })
}

if (process.version.startsWith('v10')) {
  test('pifs: align exports with Node v10', async (t) => {
    const originalFs = await import('fs')
    const pifs = await import('../src')

    const namesToIgnore = [
      'default',
      'exists',
      'promises',
      '_toUnixTimestamp',
      'gracefulify',
      'FileReadStream',
      'FileWriteStream',
      'F_OK',
      'R_OK',
      'W_OK',
      'X_OK',
    ]
    let hasErrors = false

    const names = Object.keys(originalFs)
      .filter((name) => !name.endsWith('Sync'))
      .filter((name) => !namesToIgnore.includes(name))

    for (const name of names) {
      if (!Reflect.has(pifs, name)) {
        hasErrors = true
        t.fail(`${name} is missing`)
      }

      if (!Reflect.has(pifs.default, name)) {
        hasErrors = true
        t.fail(`default.${name} is missing`)
      }
    }

    for (const name of Object.keys(pifs)) {
      if (name !== 'default' && !Reflect.has(originalFs, name)) {
        hasErrors = true
        t.fail(`${name} is unknown`)
      }
    }

    for (const name of Object.keys(pifs.default)) {
      if (!Reflect.has(originalFs.default, name)) {
        hasErrors = true
        t.fail(`default.${name} is unknown`)
      }
    }

    if (!hasErrors) {
      t.pass('should align exported names')
    }
  })
}
