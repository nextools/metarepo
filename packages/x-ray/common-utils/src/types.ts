import { TLineElement } from 'syntx'

export type TCheckRequest = { type: 'FILE', path: string } | { type: 'DONE' }

export type TOptions = {
  mocks?: {
    [k: string]: string,
  },
  extensions: string[],
  entryPointField: 'main' | 'browser' | 'react-native',
  platform: string,
}

export type TItem = {
  serializedElement: TLineElement[][],
  width: number,
  height: number,
}
