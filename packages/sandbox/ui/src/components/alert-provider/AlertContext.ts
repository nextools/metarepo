import { createContext } from 'react'

export type TAlertContext = {
  sendAlert: (message: string) => void,
}

export const AlertContext = createContext<TAlertContext>({
  sendAlert: () => {},
})
