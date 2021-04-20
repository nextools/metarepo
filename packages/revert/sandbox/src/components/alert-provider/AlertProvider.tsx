import { Layout, Layout_Item, LAYOUT_SIZE_FIT } from '@revert/layout'
import { nanoid } from 'nanoid/non-secure'
import { Fragment } from 'react'
import { component, startWithType, mapHandlers, mapState } from 'refun'
import { AlertContext } from './AlertContext'
import { AlertItem } from './AlertItem'
import { mapOffline } from './map-offline'
import type { TAlertProvider, TAlert } from './types'

export const AlertProvider = component(
  startWithType<TAlertProvider>(),
  mapState('alerts', 'setAlerts', () => [] as TAlert[], []),
  mapHandlers({
    sendAlert: ({ alerts, setAlerts }) => (message: string) => {
      setAlerts(
        alerts.concat({
          id: nanoid(),
          message,
        })
      )
    },
    onItemClose: ({ alerts, setAlerts }) => (id: string) => {
      setAlerts(
        alerts.filter((alert) => id !== alert.id)
      )
    },
  }),
  mapOffline()
)(({
  sendAlert,
  alerts,
  children,
  onItemClose,
}) => (
  <Fragment>
    <AlertContext.Provider value={{ sendAlert }}>
      {children}
    </AlertContext.Provider>
    <Layout direction="vertical" hPadding={10} vPadding={10}>
      <Layout_Item height={LAYOUT_SIZE_FIT}>
        <Layout direction="vertical" spaceBetween={10}>
          {alerts.map(({ id, message }) => (
            <Layout_Item key={id}>
              <AlertItem id={id} onClose={onItemClose}>
                {message}
              </AlertItem>
            </Layout_Item>
          ))}
        </Layout>
      </Layout_Item>
    </Layout>
  </Fragment>
))

AlertProvider.displayName = 'AlertProvider'
