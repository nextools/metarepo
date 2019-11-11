/* eslint-disable @typescript-eslint/consistent-type-definitions */
export type TJsonValue = string | number | boolean | null | TJsonArray | TJsonReadonlyArray | TJsonMap
export interface TJsonMap { [key: string]: TJsonValue }
export interface TJsonArray extends Array<TJsonValue> {}
export interface TJsonReadonlyArray extends ReadonlyArray<TJsonValue> {}

export const jsonParse = (str: string): TJsonValue => JSON.parse(str)
export const jsonStringify = (value: TJsonValue): string => JSON.stringify(value)
