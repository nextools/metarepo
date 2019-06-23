export type TJsonValue = string | number | boolean | null | TJsonArray | TJsonMap
export interface TJsonMap { [key: string]: TJsonValue }
export interface TJsonArray extends Array<TJsonValue> {}

export const jsonParse = (str: string): TJsonValue => JSON.parse(str)
export const jsonStringify = (value: TJsonValue): string => JSON.stringify(value)
