import { join, resolve } from 'path'
import { homedir } from 'os'
import test from 'blue-tape'
import movePath from '../src'

test('move-path: intersected paths', (t) => {
  t.equal(
    movePath('foo/index.js', 'foo/build/'),
    resolve('foo/build/index.js'),
    'should move relative file path to relative destination'
  )

  t.equal(
    movePath('src/foo/bar/', 'build/baz/'),
    resolve('build/baz/foo/bar/'),
    'should move relative folder path to relative destination'
  )

  t.equal(
    movePath(
      'src/foo/bar/index.js',
      resolve('build/baz/')
    ),
    resolve('build/baz/foo/bar/index.js'),
    'should move relative file path to absolute destination'
  )

  t.equal(
    movePath(
      'src/foo/bar/',
      resolve('build/baz/')
    ),
    resolve('build/baz/foo/bar/'),
    'should move relative folder path to absolute destination'
  )

  t.equal(
    movePath(
      resolve('src/foo/bar/index.js'),
      'build/baz/'
    ),
    resolve('build/baz/foo/bar/index.js'),
    'should move absolute path to relative destination'
  )

  t.equal(
    movePath(
      resolve('src/foo/bar/'),
      'build/baz/'
    ),
    resolve('build/baz/foo/bar/'),
    'should move absolute folder path to relative destination'
  )

  t.equal(
    movePath(
      resolve('src/foo/bar/index.js'),
      resolve('build/baz/')
    ),
    resolve('build/baz/foo/bar/index.js'),
    'should move absolute file path to absolute destination'
  )

  t.equal(
    movePath(
      resolve('src/foo/bar/'),
      resolve('build/baz/')
    ),
    resolve('build/baz/foo/bar/'),
    'should move absolute folder path to absolute destination'
  )

  t.end()
})

test('move-path: not intersected paths', (t) => {
  t.equal(
    movePath(
      'src/foo/bar/index.js',
      `${homedir()}/build/baz`
    ),
    join(homedir(), 'build/baz/foo/bar/index.js'),
    'should move relative file path to not intersected absolute destination'
  )

  t.equal(
    movePath(
      'src/foo/bar/',
      `${homedir()}/build/baz`
    ),
    join(homedir(), 'build/baz/foo/bar'),
    'should move relative folder path to not intersected absolute destination'
  )

  t.equal(
    movePath(
      resolve('src/foo/bar/index.js'),
      `${homedir()}/build/baz`
    ),
    join(homedir(), 'build/baz/foo/bar/index.js'),
    'should move absolute file path to not intersected absolute destination'
  )

  t.equal(
    movePath(
      resolve('src/foo/bar/'),
      `${homedir()}/build/baz`
    ),
    join(homedir(), 'build/baz/foo/bar'),
    'should move absolute folder path to not intersected absolute destination'
  )

  t.end()
})

test('move-path: nested paths: one level', (t) => {
  t.equal(
    movePath('src/foo/bar/index.js', 'src/'),
    resolve('src/foo/bar/index.js'),
    'should move relative file path to relative nested destination'
  )

  t.equal(
    movePath('src/foo/bar/', 'src/'),
    resolve('src/foo/bar/'),
    'should move relative folder path to relative nested destination'
  )

  t.equal(
    movePath(
      'src/foo/bar/index.js',
      resolve('src/')
    ),
    resolve('src/foo/bar/index.js'),
    'should move relative file path to absolute nested destination'
  )

  t.equal(
    movePath(
      'src/foo/bar/',
      resolve('src/')
    ),
    resolve('src/foo/bar/'),
    'should move relative folder path to absolute nested destination'
  )

  t.equal(
    movePath(
      resolve('src/foo/bar/index.js'),
      'src/'
    ),
    resolve('src/foo/bar/index.js'),
    'should move absolute file path to relative nested destination'
  )

  t.equal(
    movePath(
      resolve('src/foo/bar/'),
      'src/'
    ),
    resolve('src/foo/bar/'),
    'should move absolute folder path to relative nested destination'
  )

  t.equal(
    movePath(
      resolve('src/foo/bar/index.js'),
      resolve('src/')
    ),
    resolve('src/foo/bar/index.js'),
    'should move absolute file path to absolute nested destination'
  )

  t.equal(
    movePath(
      resolve('src/foo/bar/'),
      resolve('src/')
    ),
    resolve('src/foo/bar/'),
    'should move absolute folder path to absolute nested destination'
  )

  t.end()
})

test('move-path: nested paths: multiple levels', (t) => {
  t.equal(
    movePath('src/foo/bar/index.js', 'src/foo/bar/'),
    resolve('src/foo/bar/index.js'),
    'should move relative file path to relative nested destination'
  )

  t.equal(
    movePath('src/foo/bar/', 'src/foo/bar/'),
    resolve('src/foo/bar/'),
    'should move relative folder path to the same relative destination'
  )

  t.equal(
    movePath(
      'src/foo/bar/index.js',
      resolve('src/foo/bar/')
    ),
    resolve('src/foo/bar/index.js'),
    'should move relative file path to absolute nested destination'
  )

  t.equal(
    movePath(
      'src/foo/bar/',
      resolve('src/foo/bar/')
    ),
    resolve('src/foo/bar/'),
    'should move relative folder path to the same absolute destination'
  )

  t.equal(
    movePath(
      resolve('src/foo/bar/index.js'),
      'src/foo/bar/'
    ),
    resolve('src/foo/bar/index.js'),
    'should move absolute file path to relative nested destination'
  )

  t.equal(
    movePath(
      resolve('src/foo/bar/'),
      'src/foo/bar/'
    ),
    resolve('src/foo/bar/'),
    'should move absolute folder path to the same relative destination'
  )

  t.equal(
    movePath(
      resolve('src/foo/bar/index.js'),
      resolve('src/foo/bar/')
    ),
    resolve('src/foo/bar/index.js'),
    'should move absolute file path to absolute nested destination'
  )

  t.equal(
    movePath(
      resolve('src/foo/bar/'),
      resolve('src/foo/bar/')
    ),
    resolve('src/foo/bar/'),
    'should move absolute folder path to the same absolute destination'
  )

  t.end()
})

test('move-path: destination is current working directory', (t) => {
  t.equal(
    movePath('src/foo/bar/index.js', './'),
    resolve('src/foo/bar/index.js'),
    'should move relative file path to relative destination'
  )

  t.equal(
    movePath('src/foo/bar/', './'),
    resolve('src/foo/bar/'),
    'should move relative folder path to relative destination'
  )

  t.equal(
    movePath(
      'src/foo/bar/index.js',
      process.cwd()
    ),
    resolve('src/foo/bar/index.js'),
    'should move relative file path to absolute destination'
  )

  t.equal(
    movePath(
      'src/foo/bar/',
      process.cwd()
    ),
    resolve('src/foo/bar/'),
    'should move relative folder path to absolute destination'
  )

  t.equal(
    movePath(
      resolve('src/foo/bar/index.js'),
      process.cwd()
    ),
    resolve('src/foo/bar/index.js'),
    'should move absolute file path to absolute destination'
  )

  t.equal(
    movePath(
      resolve('src/foo/bar/'),
      process.cwd()
    ),
    resolve('src/foo/bar/'),
    'should move absolute folder path to absolute destination'
  )

  t.end()
})
