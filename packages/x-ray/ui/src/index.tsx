import React, { FC } from 'react'
import { Root } from '@revert/root'
import { Main } from './components/Main'
// import { PortalProvider } from './components/Portal'

export const App: FC<{}> = () => (
  <Root>
    {/* <PortalProvider> */}
    <Main/>
    {/* </PortalProvider> */}
  </Root>
)
