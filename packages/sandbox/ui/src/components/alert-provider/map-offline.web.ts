import { pipe } from '@psxcode/compose'
import { startWithType, onMountUnmount } from 'refun'
import { globalObject } from '../../utils'
import { TAlert } from './types'

const OFFLINE_ID = 'OFFLINE'

export type TMapOffline = {
  alerts: TAlert[],
  setAlerts: (alerts: TAlert[]) => void,
  onItemClose: (id: string) => void,
}

export const mapOffline = <P extends TMapOffline> () => pipe(
  startWithType<P>(),
  onMountUnmount(({ alerts, setAlerts, onItemClose }) => {
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
  })
)
