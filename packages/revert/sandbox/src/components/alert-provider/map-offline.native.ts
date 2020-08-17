import { pipe } from '@psxcode/compose'
import { startWithType } from 'refun'
import type { TAlert } from './types'

export type TMapOffline = {
  alerts: TAlert[],
  setAlerts: (alerts: TAlert[]) => void,
  onItemClose: (id: string) => void,
}

export const mapOffline = <P extends TMapOffline> () => pipe(
  startWithType<P>()
)
