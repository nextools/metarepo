import { relative } from 'path'
import chalk from 'chalk'
import { TMessage, TTotalResult } from './types'

const makeLogger = () => {
  const toRelativePath = (path: string) => relative(process.cwd(), path)
  const result: TTotalResult = { ok: 0, diff: 0, new: 0 }

  const log = (message: TMessage) => {
    const logSnapshot = (str: string) => {
      console.log(str, toRelativePath(message.path))
    }

    switch (message.status) {
      case 'ok': {
        result.ok += 1

        return logSnapshot(chalk.reset.green('ok:'))
      }

      case 'diff': {
        result.diff += 1

        return logSnapshot(chalk.reset.red('diff:'))
      }

      case 'new': {
        result.new += 1

        return logSnapshot(chalk.reset.blue('new:'))
      }

      case 'unknown': {
        return logSnapshot(chalk.reset.red('unknown:'))
      }
    }
  }

  return {
    log,
    totalResult: () => result,
  }
}

export default makeLogger
