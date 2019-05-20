import path from 'path'
import webpack, { Stats } from 'webpack'
import { getConfig } from './get-config'

export type TBuildWebOptions = {
  entryPointPath: string,
  outputPath: string,
  htmlTemplatePath: string,
}

const statsOptions: Stats.ToStringOptionsObject = {
  colors: true,
  assets: true,
  assetsSort: '!size',
  builtAt: false,
  children: false,
  entrypoints: false,
  errors: true,
  errorDetails: true,
  excludeAssets: [/\.js\.map$/],
  hash: false,
  modules: false,
  performance: true,
  timings: false,
  version: false,
  warnings: true,
}

export const buildWeb = (options: TBuildWebOptions) => {
  const config = getConfig(
    path.resolve(options.entryPointPath),
    path.resolve(options.outputPath),
    path.resolve(options.htmlTemplatePath)
  )

  return new Promise<void>((resolve, reject) => {
    webpack(config, (err, stats) => {
      if (err) {
        return reject(err)
      }

      console.log(stats.toString(statsOptions))

      resolve()
    })
  })
}
