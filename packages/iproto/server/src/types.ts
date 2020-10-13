export type TMessage =
{ type: 'REQUEST' } |
{ type: 'BREAK' } |
{ type: 'RESPONSE', value: any }

export type TServeIterableOptions = {
  host: string,
  port: number,
}
