import { getPackages } from '@auto/core'
import prompts from 'prompts'
import { spawnChildProcess } from 'spown'
import { getPrefixes } from './get-refixes'
import { removeAutoNamePrefix } from './remove-auto-name-prefix'
import { suggestFilter } from './suggest-filter'

const toLowerCase = (str: string) => str.charAt(0).toLocaleLowerCase() + str.slice(1)

export const makeCommit = async () => {
  const prefixes = await getPrefixes()
  const packages = await getPackages()
  const allPackageNames = Array.from(packages.keys()).map(removeAutoNamePrefix)

  const { prefix } = await prompts({
    type: 'select',
    name: 'prefix',
    message: 'Select change type',
    choices: Object.keys(prefixes).map((name) => (prefixes[name])),
  }) as { prefix?: string }

  if (typeof prefix !== 'string') {
    throw new Error('Change type is required')
  }

  const packageNames: string [] = []

  while (true) {
    const { packageName } = await prompts({
      type: 'autocomplete',
      name: 'packageName',
      message: 'Type package name',
      limit: 20,
      choices: allPackageNames
        .filter((name) => !packageNames.includes(name))
        .map((name) => ({ title: name, value: name })),
      suggest: suggestFilter(packageNames.length > 0 ? '(done)' : '(no package)'),
    }) as { packageName?: string }

    if (typeof packageName !== 'string') {
      throw new Error('Package name is required')
    }

    if (packageName === '-') {
      break
    }

    packageNames.push(packageName)

    if (packageName === '*') {
      break
    }
  }

  const { message } = await prompts({
    type: 'text',
    name: 'message',
    message: 'Type commit message',
  }) as { message?: string }

  if (typeof message === 'undefined') {
    throw new Error('Commit message is required')
  }

  let name = ''

  if (packageNames.length > 0) {
    name = `${packageNames.join(', ')}: `
  }

  await spawnChildProcess(
    `git commit -m "${prefix} ${name}${toLowerCase(message.trim())}"`,
    {
      stdout: null,
      stderr: process.stderr,
    }
  )
}
