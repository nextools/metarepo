import React from 'react'
import { component, startWithType, mapContext, mapState } from 'refun'
import { PrimitiveBlockRef } from '../primitive-block-ref'
import { RootContext } from '../root'
import { TPortalContext, PortalContext } from './PortalContext'
import { TPortalProvider } from './types'

export const PortalProvider = component(
  startWithType<TPortalProvider>(),
  mapContext(RootContext),
  mapState('ref', 'setRef', () => null as TPortalContext['portalElement'], [])
)(({ ref, setRef, _rootWidth, _rootHeight, children }) => (
  <PrimitiveBlockRef left={0} top={0} width={_rootWidth} height={_rootHeight} ref={setRef}>
    <PortalContext.Provider value={{ portalElement: ref }}>
      {children}
    </PortalContext.Provider>
  </PrimitiveBlockRef>
))

PortalProvider.displayName = 'PortalProvider'
