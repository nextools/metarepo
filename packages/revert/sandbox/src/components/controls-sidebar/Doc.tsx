import { Layout, Layout_Item } from '@revert/layout'
import { Scroll } from '@revert/scroll'
import { startWithType, pureComponent } from 'refun'
import { mapMetaStoreState } from '../../store-meta'
import { Markdown } from '../markdown'
import { Text } from '../text'

export const Doc = pureComponent(
  startWithType<{}>(),
  mapMetaStoreState(({ readme }) => ({
    readme,
  }), ['readme'])
)(({ readme }) => {
  if (readme === null) {
    return (
      <Layout direction="vertical">
        <Layout_Item hAlign="center" vAlign="center">
          <Text>No readme</Text>
        </Layout_Item>
      </Layout>
    )
  }

  return (
    <Scroll shouldScrollVertically>
      <Markdown source={readme}/>
    </Scroll>
  )
})

Doc.displayName = 'Doc'
Doc.componentSymbol = Symbol('CONTROLS_SIDEBAR_DOC')
