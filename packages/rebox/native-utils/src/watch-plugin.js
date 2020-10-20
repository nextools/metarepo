/* eslint-disable max-params */
import path from 'path'

class WatchFileSystem {
  constructor(wfs) {
    this.wfs = wfs
  }

  watch(files, dirs, missing, startTime, options, callback, callbackUndelayed) {
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

export class WatchPlugin {
  apply(compiler) {
    compiler.hooks.afterEnvironment.tap('WatchPlugin', () => {
      compiler.watchFileSystem = new WatchFileSystem(
        compiler.watchFileSystem
      )
    })
  }
}
