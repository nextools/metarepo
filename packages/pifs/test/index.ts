/* eslint-disable import/no-named-as-default-member */
import test from 'blue-tape'
import fs, { readFile } from '../src'

test('pifs', (t) => {
  t.equal(
    typeof fs.readFile,
    'function',
    'should export default object'
  )

  t.equal(
    typeof readFile,
    'function',
    'should export named methods'
  )

  t.end()
})
