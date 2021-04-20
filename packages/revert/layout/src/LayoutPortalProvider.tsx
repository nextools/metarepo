import { PrimitiveBlock } from '@revert/block'
import { component, startWithType, mapState } from 'refun'
import type { TLayoutPortalContext } from './LayoutPortalContext'
import { LayoutPortalContext } from './LayoutPortalContext'

export const LayoutPortalProvider = component(
  startWithType<{}>(),
  mapState('ref', 'setRef', () => null as TLayoutPortalContext['portalElement'], [])
)(({ ref, setRef, children }) => (
  <LayoutPortalContext.Provider value={{ portalElement: ref }}>
    {children}
    <PrimitiveBlock onRef={setRef}/>
  </LayoutPortalContext.Provider>
))

LayoutPortalProvider.displayName = 'LayoutPortalProvider'
