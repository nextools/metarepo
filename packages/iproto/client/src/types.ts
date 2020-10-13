export type TResponse = { type: 'DONE' } | { type: 'RESPONSE', value: any }

export type TGetIterableOptions = {
  host: string,
  port: number,
}
