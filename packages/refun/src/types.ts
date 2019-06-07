import { FC, ReactElement } from 'react'
import { TOmitKey } from 'tsfn'

export interface TComponent<T> extends FC<T> {
  [k: string]: any,
}

export interface TPureComponent<T> extends FC<T> {
  (props: TOmitKey<T, 'children'>, context?: any): ReactElement | null,
  [k: string]: any,
}
