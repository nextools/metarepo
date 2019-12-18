import React, { Fragment } from 'react'
import { component, startWithType, mapHandlers, mapState } from 'refun'
import nanoid from 'nanoid/non-secure'
import { Layout, Layout_Item } from '../layout'
import { LAYOUT_SIZE_FIT } from '../../symbols'
import { AlertContext } from './AlertContext'
import { AlertItem } from './AlertItem'
import { TAlertProvider, TAlert } from './types'
import { mapOffline } from './map-offline'

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
            <Layout_Item id={id} key={id}>
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
