/* eslint-disable max-params */
import path from 'path'
import { Plugin, Compiler } from 'webpack'

type IWatch = {
  watch: (files: string[], dirs: string[], missing: {}, startTime: number, options: {}, callback: () => {}, callbackUndelayed: () => {}) => void,
}

class WatchFileSystem implements IWatch {
  wfs: IWatch

  constructor(wfs: IWatch) {
    this.wfs = wfs
  }

  watch(files: string[], dirs: string[], missing: {}, startTime: number, options: {}, callback: () => {}, callbackUndelayed: () => {}) {
    return this.wfs.watch(
      [path.resolve('package.json'), ...files],
      dirs,
      missing,
      startTime,
      options,
      callback,
      callbackUndelayed
    )
  }
}

export class WatchPlugin implements Plugin {
  apply(compiler: Compiler & { watchFileSystem: IWatch }) {
    compiler.hooks.afterEnvironment.tap('WatchPlugin', () => {
      compiler.watchFileSystem = new WatchFileSystem(
        compiler.watchFileSystem
      )
    })
  }
}
