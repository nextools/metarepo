import { TPrefixes } from '@auto/utils'

export const prefixes: TPrefixes = {
  required: {
    major: {
      title: 'Breaking change',
      value: '💥',
    },
    minor: {
      title: 'New feature',
      value: '🌱',
    },
    patch: {
      title: 'Bugfix',
      value: '🐞',
    },
    publish: {
      title: 'New version',
      value: '📦',
    },
    dependencies: {
      title: 'Dependencies',
      value: '♻️',
    },
    initial: {
      title: 'Initial',
      value: '🐣',
    },
  },
  custom: [
    {
      title: 'Dependencies',
      value: '♻️',
    },
    {
      title: 'Lint',
      value: '🚷',
    },
    {
      title: 'Test',
      value: '👾',
    },
    {
      title: 'Docs',
      value: '📝',
    },
    {
      title: 'Demo',
      value: '📺',
    },
    {
      title: 'Refactor',
      value: '🛠',
    },
    {
      title: 'WIP',
      value: '🚧',
    },
    {
      title: 'Snapshots / Screenshots',
      value: '📸',
    },
    {
      title: 'Other',
      value: '🛠',
    },
  ],
}
