export type TAnyObject = {
  [key: string]: any,
}
export type TKeyOf<T> = (keyof T) & string

export type TIntersect <T1 extends {}, T2 extends {}> = {
  [K in Extract<keyof T1, keyof T2>]: T1[K]
}

export type TRequireKeys<T, K extends keyof T> = T & {
  [P in Extract<keyof T, K>]: Exclude<T[P], undefined>
}

export type TOptionalKeys<T extends {}> = Exclude<{
  [K in TKeyOf<T>]: T extends Record<K, T[K]>
    ? never
    : K
}[TKeyOf<T>], undefined>

export type TRequiredKeys<T extends {}> = Exclude<{
  [K in TKeyOf<T>]: T extends Record<K, T[K]>
    ? K
    : never
}[TKeyOf<T>], undefined>

export type TWritable<T> = { -readonly [K in keyof T]: T[K] }

export type TOmitKey<T extends {}, K extends PropertyKey> = Pick<T, Exclude<keyof T, K>>

export type TPrimitive = string | number | boolean | bigint | symbol | undefined | null

export type TBuiltin = TPrimitive | Function | Date | Error | RegExp

export type TReadonly<T> = T extends TBuiltin
  ? T
  : T extends Map<infer K, infer V>
    ? ReadonlyMap<TReadonly<K>, TReadonly<V>>
    : T extends ReadonlyMap<infer K, infer V>
      ? ReadonlyMap<TReadonly<K>, TReadonly<V>>
      : T extends Set<infer U>
        ? ReadonlySet<TReadonly<U>>
        : T extends ReadonlySet<infer U>
          ? ReadonlySet<TReadonly<U>>
          : T extends Promise<infer U>
            ? Promise<TReadonly<U>>
            : T extends {}
              ? { readonly [K in keyof T]: TReadonly<T[K]> }
              : Readonly<T>

export type TNonNullableObject<T extends {}> = {
  [k in keyof T]: NonNullable<T[k]>
}
