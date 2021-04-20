import { Background } from '@revert/background'
import { PrimitiveBlock } from '@revert/block'
import { rgba } from '@revert/color'
import { Root, RootContext } from '@revert/root'
import type { FC } from 'react'
import { component, mapContext, mapState, startWithType } from 'refun'
import type { TLayoutPortalContext } from '../../src'
import { Layout_Resize, Layout, Layout_Item, LayoutPortalContext } from '../../src'

export const PortalProvider = component(
  startWithType<{}>(),
  mapContext(RootContext),
  mapState('ref', 'setRef', () => null as TLayoutPortalContext['portalElement'], [])
)(({ ref, setRef, _rootWidth, _rootHeight, children }) => (
  <PrimitiveBlock id="portal" left={0} top={0} width={_rootWidth} height={_rootHeight} onRef={setRef}>
    <LayoutPortalContext.Provider value={{ portalElement: ref }}>
      {children}
    </LayoutPortalContext.Provider>
  </PrimitiveBlock>
))

PortalProvider.displayName = 'PortalProvider'

export const App: FC<{}> = () => {
  return (
    <Root>
      <PortalProvider>
        <Layout direction="horizontal">
          <Layout_Item>
            <Background color={rgba(78, 90, 39, 1)}/>
          </Layout_Item>
          <Layout_Resize width={20} id="slider">
            <Background color={rgba(128, 0, 0, 1)}/>
          </Layout_Resize>
          <Layout_Item>
            <Background color={rgba(78, 90, 39, 1)}/>
          </Layout_Item>
        </Layout>
      </PortalProvider>
    </Root>
  )
}
