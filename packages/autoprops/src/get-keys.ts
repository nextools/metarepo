import { Keys, PropsWithValues, TProps } from './types'

export const getKeys = <Props extends TProps> (
  props: PropsWithValues<Props>
): Keys<Props> => Object.keys(props) as Keys<Props>
