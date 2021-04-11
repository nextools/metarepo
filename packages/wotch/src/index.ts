import { resolve } from 'path'
import { watchDir } from './watch-dir'

const dir = resolve('tmp/watch')
let i = 0

for await (const path of watchDir(dir)) {
  i++

  console.log(path)

  if (i === 4) {
    break
  }
}
