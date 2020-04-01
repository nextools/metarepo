import { Module } from './module'

export const uncacheModule = (module: NodeModule): void => {
  Reflect.deleteProperty(Module._cache, module.id)

  for (const child of module.children) {
    if (Reflect.has(Module._cache, child.id)) {
      uncacheModule(child)
    }
  }
}
