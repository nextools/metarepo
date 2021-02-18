import { Layout, Layout_Item, Layout_Spacer, LAYOUT_SIZE_FIT } from '@revert/layout'
import { nanoid } from 'nanoid/non-secure'
import { Fragment } from 'react'
import { component, startWithType, mapHandlers, mapState } from 'refun'
import { NotificationContext } from './NotificationContext'
import { NotificationItem } from './NotificationItem'

const NOTIFICATION_WIDTH = 360

type TNotification = {
  id: string,
  message: string,
}

export type TNotificationProvider = {}

export const NotificationProvider = component(
  startWithType<TNotificationProvider>(),
  mapState('notifications', 'setNotifications', () => [] as TNotification[], []),
  mapHandlers({
    sendNotification: ({ notifications, setNotifications }) => (message: string) => {
      setNotifications(
        notifications.concat({
          id: nanoid(),
          message,
        })
      )
    },
    onItemClose: ({ notifications, setNotifications }) => (id: string) => {
      setNotifications(
        notifications.filter((notification) => id !== notification.id)
      )
    },
  })
)(({
  sendNotification,
  notifications,
  children,
  onItemClose,
}) => (
  <Fragment>
    <NotificationContext.Provider value={{ sendNotification }}>
      {children}
    </NotificationContext.Provider>
    <Layout hPadding={10} vPadding={10}>
      <Layout_Spacer/>
      <Layout_Item width={NOTIFICATION_WIDTH}>
        <Layout direction="vertical">
          <Layout_Spacer/>
          <Layout_Item height={LAYOUT_SIZE_FIT}>
            <Layout direction="vertical" spaceBetween={10}>
              {notifications.map(({ id, message }) => (
                <Layout_Item key={id}>
                  <NotificationItem id={id} onClose={onItemClose}>
                    {message}
                  </NotificationItem>
                </Layout_Item>
              ))}
            </Layout>
          </Layout_Item>
        </Layout>
      </Layout_Item>
    </Layout>
  </Fragment>
))

NotificationProvider.displayName = 'NotificationProvider'
