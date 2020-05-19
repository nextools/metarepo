type TPipeFn<K0, V0, K1, V1> = (arg: Iterable<readonly [K0, V0]>) => Iterable<readonly [K1, V1]>

class MapClass<K, V> {
  static from<K, V>(source: Iterable<readonly [K, V]>): TMap<K, V> {
    return new MapClass(source)
  }

  static async fromAsync<K, V>(source: AsyncIterable<readonly [K, V]>): Promise<TMap<K, V>> {
    const map = new MapClass<K, V>()

    for await (const entry of source) {
      map.set(entry[0], entry[1])
    }

    return map
  }

  #map: Map<K, V>

  constructor(source?: Iterable<readonly [K, V]>) {
    this.#map = new global.Map(source!)
  }

  [Symbol.iterator](): Iterator<readonly [K, V]> {
    return this.#map[Symbol.iterator]()
  }

  get [Symbol.toStringTag]() {
    return 'IdaMap'
  }

  get size(): number {
    return this.#map.size
  }

  clear(): this {
    this.#map.clear()

    return this
  }

  delete(key: K): this {
    this.#map.delete(key)

    return this
  }

  has(key: K): boolean {
    return this.#map.has(key)
  }

  get(key: K): V | undefined
  get(key: K, fallbackValue: V): V
  get(key: any, fallbackValue?: any) {
    if (this.#map.has(key)) {
      return this.#map.get(key)
    }

    return fallbackValue
  }

  set(key: K, value: V): this {
    this.#map.set(key, value)

    return this
  }

  update(key: K, updateFn: (value?: V) => V): this
  update(key: K, updateFn: (value: V) => V, fallbackValue: V): this
  update(key: any, updateFn: any, fallbackValue?: any) {
    if (this.#map.has(key)) {
      this.#map.set(key, updateFn(this.#map.get(key)!))
    } else {
      this.#map.set(key, updateFn(fallbackValue))
    }

    return this
  }

  keys(): Iterable<K> {
    return this.#map.keys()
  }

  values(): Iterable<V> {
    return this.#map.values()
  }

  pipe(): TMap<K, V>
  pipe<K0, V0, K1, V1>(fn0: TPipeFn<K0, V0, K1, V1>): TMap<K1, V1>
  pipe<K0, V0, K1, V1, K2, V2>(fn0: TPipeFn<K0, V0, K1, V1>, fn1: TPipeFn<K1, V1, K2, V2>): TMap<K2, V2>
  pipe<K0, V0, K1, V1, K2, V2, K3, V3>(fn0: TPipeFn<K0, V0, K1, V1>, fn1: TPipeFn<K1, V1, K2, V2>, fn2: TPipeFn<K2, V2, K3, V3>): TMap<K3, V3>
  pipe<K0, V0, K1, V1, K2, V2, K3, V3, K4, V4>(fn0: TPipeFn<K0, V0, K1, V1>, fn1: TPipeFn<K1, V1, K2, V2>, fn2: TPipeFn<K2, V2, K3, V3>, fn3: TPipeFn<K3, V3, K4, V4>): TMap<K4, V4>
  pipe<K0, V0, K1, V1, K2, V2, K3, V3, K4, V4, K5, V5>(fn0: TPipeFn<K0, V0, K1, V1>, fn1: TPipeFn<K1, V1, K2, V2>, fn2: TPipeFn<K2, V2, K3, V3>, fn3: TPipeFn<K3, V3, K4, V4>, fn4: TPipeFn<K4, V4, K5, V5>): TMap<K5, V5>
  pipe<K0, V0, K1, V1, K2, V2, K3, V3, K4, V4, K5, V5, K6, V6>(fn0: TPipeFn<K0, V0, K1, V1>, fn1: TPipeFn<K1, V1, K2, V2>, fn2: TPipeFn<K2, V2, K3, V3>, fn3: TPipeFn<K3, V3, K4, V4>, fn4: TPipeFn<K4, V4, K5, V5>, fn5: TPipeFn<K5, V5, K6, V6>): TMap<K6, V6>
  pipe<K0, V0, K1, V1, K2, V2, K3, V3, K4, V4, K5, V5, K6, V6, K7, V7>(fn0: TPipeFn<K0, V0, K1, V1>, fn1: TPipeFn<K1, V1, K2, V2>, fn2: TPipeFn<K2, V2, K3, V3>, fn3: TPipeFn<K3, V3, K4, V4>, fn4: TPipeFn<K4, V4, K5, V5>, fn5: TPipeFn<K5, V5, K6, V6>, fn6: TPipeFn<K6, V6, K7, V7>): TMap<K7, V7>
  pipe<K0, V0, K1, V1, K2, V2, K3, V3, K4, V4, K5, V5, K6, V6, K7, V7, K8, V8>(fn0: TPipeFn<K0, V0, K1, V1>, fn1: TPipeFn<K1, V1, K2, V2>, fn2: TPipeFn<K2, V2, K3, V3>, fn3: TPipeFn<K3, V3, K4, V4>, fn4: TPipeFn<K4, V4, K5, V5>, fn5: TPipeFn<K5, V5, K6, V6>, fn6: TPipeFn<K6, V6, K7, V7>, fn7: TPipeFn<K7, V7, K8, V8>): TMap<K8, V8>
  pipe(...fns: any[]) {
    return new MapClass(
      fns.reduce(
        (arg, fn) => fn(arg),
        this.#map
      )
    )
  }

  toObject(): { [key: string]: V } {
    const result = {} as { [key: string]: V }

    for (const [key, value] of this.#map) {
      result[String(key)] = value
    }

    return result
  }

  toNativeMap(): Map<K, V> {
    return new global.Map(this.#map)
  }
}

export type TMap<K, V> = MapClass<K, V>

export const Map = MapClass
