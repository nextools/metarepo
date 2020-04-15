export const shallowEqualByKeys = <T extends {}>(a: T, b: T, keys: (keyof T)[]) => {
  if (a === b) {
    return true
  }

  for (const key of keys) {
    if (a[key] !== b[key]) {
      return false
    }
  }

  return true
}

export const generatorIdFactory = () => {
  let latestId = 0
  const ids = new Set<number>()

  const switchToGenerator = (id: number) => () => {
    ids.clear()
    ids.add(id)
  }

  const newId = () => {
    const id = latestId++

    ids.add(id)

    return id
  }

  const isGeneratorRunning = (id: number) => ids.has(id)

  return {
    switchToGenerator,
    newId,
    isGeneratorRunning,
  }
}

export const unwindGenerator = <T>(gen: Generator<Promise<T>, void, T>, shouldContinue: () => boolean): void => {
  const handle = async (ir: IteratorResult<Promise<T>>): Promise<void> => {
    if (ir.done) {
      return
    }

    try {
      const value = await ir.value

      console.log('AFTER')

      if (shouldContinue()) {
        return handle(gen.next(value))
      }

      gen.return()
    } catch (e) {
      if (shouldContinue()) {
        return handle(gen.throw(e))
      }

      gen.return()
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  handle(gen.next())
}
