import { PrimitiveBlock } from '@revert/block'
import { RootContext } from '@revert/root'
import React from 'react'
import { component, startWithType, mapContext, mapState } from 'refun'
import { PortalContext } from './PortalContext'
import type { TPortalContext } from './PortalContext'
import type { TPortalProvider } from './types'

export const PortalProvider = component(
  startWithType<TPortalProvider>(),
  mapContext(RootContext),
  mapState('ref', 'setRef', () => null as TPortalContext['portalElement'], [])
)(({ ref, setRef, _rootWidth, _rootHeight, children }) => (
  <PrimitiveBlock left={0} top={0} width={_rootWidth} height={_rootHeight} onRef={setRef}>
    <PortalContext.Provider value={{ portalElement: ref }}>
      {children}
    </PortalContext.Provider>
  </PrimitiveBlock>
))

PortalProvider.displayName = 'PortalProvider'
