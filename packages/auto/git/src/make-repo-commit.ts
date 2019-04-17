import prompts from 'prompts'
import execa from 'execa'
import { TPrefixes } from '@auto/utils'
import { toLowerCase } from './utils'

export const makeRepoCommit = async (prefixes: TPrefixes) => {
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
    initial: 1,
  }) as { prefix?: string }

  if (typeof prefix === 'undefined') {
    throw new Error('Change type is required')
  }

  const { message } = await prompts({
    type: 'text',
    name: 'message',
    message: 'Type commit message',
  }) as { message?: string }

  if (typeof message === 'undefined') {
    throw new Error('Commit message is required')
  }

  await execa(
    'git',
    [
      'commit',
      '-m',
      `${prefix} ${toLowerCase(message.trim())}`,
    ],
    {
      stdout: process.stdout,
      stderr: null,
    }
  )
}
