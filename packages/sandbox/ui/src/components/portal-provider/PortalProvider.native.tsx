import React, { FC, Fragment } from 'react'
import { TPortalProvider } from './types'

export const PortalProvider: FC<TPortalProvider> = ({ children }) => (
  <Fragment>
    {children}
  </Fragment>
)
