import path from 'path'

export type TGetTarFilePath = {
  examplesFilePath: string,
  examplesName: string,
  pluginName: string,
}

export const getTarFilePath = (options: TGetTarFilePath): string => {
  const examplesDirPath = path.dirname(options.examplesFilePath)

  return path.join(examplesDirPath, '__data__', `${options.examplesName}-${options.pluginName}.tar.gz`)
}
