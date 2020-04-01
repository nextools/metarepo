import { Module } from './module'
import { uncacheModule } from './uncache-module'

export const uncacheKey = (key: string): void => {
  const cache = Module._cache

  if (!Reflect.has(cache, key)) {
    return
  }

  const module = cache[key]

  /* istanbul ignore else */
  if (module.parent !== null) {
    const i = module.parent.children.findIndex((child) => child.id === key)

    /* istanbul ignore else */
    if (i >= 0) {
      module.parent.children.splice(i, 1)
    }
  }

  uncacheModule(module)
}
