import path from 'path'
import type { StartPlugin } from '@start/plugin'
import copy from '@start/plugin-copy'
import find from '@start/plugin-find'
import sequence from '@start/plugin-sequence'
import { buildPackageJson } from './build-package-json'

export default (packageDir: string): StartPlugin<{}, {}> => {
  const dir = path.join('packages', packageDir)

  return sequence(
    find(`${dir}/{readme,license}.md`),
    copy(`${dir}/build/`),
    buildPackageJson(dir)
  )
}
