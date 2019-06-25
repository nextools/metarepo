import prompts from 'prompts'
import execa from 'execa'
import { TPackages, TPrefixes, suggestFilter, TWorkspacesOptions, removeAutoNamePrefix } from '@auto/utils'
import { toLowerCase } from './utils'

export const makeCommit = async (packages: TPackages, prefixes: TPrefixes, workspaceOptions: TWorkspacesOptions) => {
  const { prefix } = await prompts({
    type: 'select',
    name: 'prefix',
    message: 'Select change type',
    choices: [
      prefixes.required.major,
      prefixes.required.minor,
      prefixes.required.patch,
      prefixes.required.initial,
      ...prefixes.custom,
    ],
  }) as { prefix?: string }

  if (typeof prefix === 'undefined') {
    throw new Error('Change type is required')
  }

  const packageNames: string [] = []

  while (true) {
    const { packageName } = await prompts({
      type: 'autocomplete',
      name: 'packageName',
      message: 'Type package name',
      limit: 20,
      choices: Object.keys(packages)
        .map((name) => removeAutoNamePrefix(name, workspaceOptions.autoNamePrefix))
        .filter((name) => !packageNames.includes(name))
        .map((name) => ({ title: name, value: name })),
      suggest: suggestFilter(packageNames.length > 0 ? '(done)' : '(no package)'),
    }) as { packageName?: string }

    if (typeof packageName === 'undefined') {
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

  await execa(
    'git',
    [
      'commit',
      '-m',
      `${prefix} ${name}${toLowerCase(message.trim())}`,
    ],
    {
      stdout: process.stdout,
      stderr: null,
    }
  )
}
