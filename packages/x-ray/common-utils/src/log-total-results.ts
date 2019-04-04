import chalk from 'chalk'
import { TTotalResult } from './types'

const logTotalResults = (results: TTotalResult[]) => {
  const totalResult = results.reduce((result, item) => {
    result.ok += item.ok
    result.new += item.new
    result.diff += item.diff

    return result
  }, { ok: 0, new: 0, diff: 0 })

  console.log()
  console.log('Total result:')
  console.log(chalk.reset.green('ok:  '), totalResult.ok)
  console.log(chalk.reset.blue('new: '), totalResult.new)
  console.log(chalk.reset.red('diff:'), totalResult.diff)
  console.log()
}

export default logTotalResults
