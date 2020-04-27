import _Module from 'module'

export const Module = _Module as unknown as TModule

export type TModule = {
  _cache: NodeJS.Require['cache'],
  _load: (request: string, parent: NodeModule, isMain: boolean) => any,
  prototype: {
    _compile: (content: string, filename: string) => void,
    __mocku__: {
      [key: string]: any,
    },
  },
  createRequire: (key: string) => NodeJS.Require,
  createRequireFromPath: (key: string) => NodeJS.Require,
  builtinModules: string[],
}
