export type TOmit<T extends {}, K extends {}> = Pick<T, Exclude<keyof T, keyof K>>
export type TOmitKey<T extends {}, K extends PropertyKey> = Pick<T, Exclude<keyof T, K>>
