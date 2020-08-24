type TPipeFn<T0, T1> = (arg: Iterable<T0>) => Iterable<T1>

class SetClass<T> {
  static from<T>(source: Iterable<T>): TSet<T> {
    return new SetClass(source)
  }

  static async fromAsync<T>(source: AsyncIterable<T>): Promise<TSet<T>> {
    const set = new SetClass<T>()

    for await (const value of source) {
      set.add(value)
    }

    return set
  }

  #set: Set<T>

  constructor(source?: Iterable<T>) {
    this.#set = new global.Set(source!)
  }

  [Symbol.iterator](): Iterator<T> {
    return this.#set[Symbol.iterator]()
  }

  get [Symbol.toStringTag]() {
    return 'IdaSet'
  }

  get size(): number {
    return this.#set.size
  }

  clear(): this {
    this.#set.clear()

    return this
  }

  delete(value: T): this {
    this.#set.delete(value)

    return this
  }

  has(value: T): boolean {
    return this.#set.has(value)
  }

  add(value: T): this {
    this.#set.add(value)

    return this
  }

  pipe(): TSet<T>
  pipe<T0, T1>(fn0: TPipeFn<T0, T1>): TSet<T1>
  pipe<T0, T1, T2>(fn0: TPipeFn<T0, T1>, fn1: TPipeFn<T1, T2>): TSet<T2>
  pipe<T0, T1, T2, T3>(fn0: TPipeFn<T0, T1>, fn1: TPipeFn<T1, T2>, fn2: TPipeFn<T2, T3>): TSet<T3>
  pipe<T0, T1, T2, T3, T4>(fn0: TPipeFn<T0, T1>, fn1: TPipeFn<T1, T2>, fn2: TPipeFn<T2, T3>, fn3: TPipeFn<T3, T4>): TSet<T4>
  pipe<T0, T1, T2, T3, T4, T5>(fn0: TPipeFn<T0, T1>, fn1: TPipeFn<T1, T2>, fn2: TPipeFn<T2, T3>, fn3: TPipeFn<T3, T4>, fn4: TPipeFn<T4, T5>): TSet<T5>
  pipe<T0, T1, T2, T3, T4, T5, T6>(fn0: TPipeFn<T0, T1>, fn1: TPipeFn<T1, T2>, fn2: TPipeFn<T2, T3>, fn3: TPipeFn<T3, T4>, fn4: TPipeFn<T4, T5>, fn5: TPipeFn<T5, T6>): TSet<T6>
  pipe<T0, T1, T2, T3, T4, T5, T6, T7>(fn0: TPipeFn<T0, T1>, fn1: TPipeFn<T1, T2>, fn2: TPipeFn<T2, T3>, fn3: TPipeFn<T3, T4>, fn4: TPipeFn<T4, T5>, fn5: TPipeFn<T5, T6>, fn6: TPipeFn<T6, T7>): TSet<T7>
  pipe<T0, T1, T2, T3, T4, T5, T6, T7, T8>(fn0: TPipeFn<T0, T1>, fn1: TPipeFn<T1, T2>, fn2: TPipeFn<T2, T3>, fn3: TPipeFn<T3, T4>, fn4: TPipeFn<T4, T5>, fn5: TPipeFn<T5, T6>, fn6: TPipeFn<T6, T7>, fn7: TPipeFn<T7, T8>): TSet<T8>
  pipe(...fns: any[]) {
    return new SetClass(
      fns.reduce(
        (arg, fn) => fn(arg),
        this.#set
      )
    )
  }

  toArray(): T[] {
    return Array.from(this.#set)
  }

  toNativeSet(): Set<T> {
    return new global.Set(this.#set)
  }
}

export type TSet<T> = SetClass<T>

export const Set = SetClass
