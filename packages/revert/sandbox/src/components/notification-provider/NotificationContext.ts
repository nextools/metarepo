import { createContext } from 'react'

export type TNotificationContext = {
  sendNotification: (message: string) => void,
}

export const NotificationContext = createContext<TNotificationContext>({
  sendNotification: () => {},
})
