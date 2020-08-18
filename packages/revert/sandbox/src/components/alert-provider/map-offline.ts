import { pipe } from '@psxcode/compose'
import { startWithType, onUpdate } from 'refun'
import { globalObject } from '../../utils'
import type { TAlert } from './types'

const OFFLINE_ID = 'OFFLINE'

export type TMapOffline = {
  alerts: TAlert[],
  setAlerts: (alerts: TAlert[]) => void,
  onItemClose: (id: string) => void,
}

export const mapOffline = <P extends TMapOffline> () => pipe(
  startWithType<P>(),
  onUpdate(({ alerts, setAlerts, onItemClose }) => {
    const onOfflineEvent = () => {
      setAlerts(
        alerts.concat({
          id: OFFLINE_ID,
          message: 'No internet connection',
        })
      )
    }

    const onOnlineEvent = () => {
      onItemClose(OFFLINE_ID)
    }

    globalObject.addEventListener('offline', onOfflineEvent)
    globalObject.addEventListener('online', onOnlineEvent)

    if (!globalObject.navigator.onLine) {
      onOfflineEvent()
    }

    return () => {
      globalObject.removeEventListener('offline', onOfflineEvent)
      globalObject.removeEventListener('online', onOnlineEvent)
    }
  }, [])
)
