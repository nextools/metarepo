export type TJsonValue = string | number | boolean | null | TJsonArray | TJsonMap
export type TJsonArray = TJsonValue[]
export type TJsonMap = { [key: string]: TJsonValue }
export type TJsonReadonlyValue = string | number | boolean | null | TJsonReadonlyArray | TJsonReadonlyMap
export type TJsonReadonlyArray = readonly TJsonReadonlyValue[]
export type TJsonReadonlyMap = { readonly [key: string]: TJsonReadonlyValue }

export const jsonParse = <T extends TJsonValue>(str: string): T => JSON.parse(str)
export const jsonStringify = <T extends TJsonValue>(value: T): string => JSON.stringify(value)
