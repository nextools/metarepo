import React, { Fragment } from 'react'
import type { FC } from 'react'
import type { TPortalProvider } from './types'

export const PortalProvider: FC<TPortalProvider> = ({ children }) => (
  <Fragment>
    {children}
  </Fragment>
)
