import { Layout, Layout_Item } from '@revert/layout'
import { Scroll } from '@revert/scroll'
import { startWithType, pureComponent } from 'refun'
import { mapConsoleStoreState } from '../../store-console'
import { SYMBOL_CONSOLE } from '../../symbols'
import { Text } from '../text'
import { LinesBlock } from './LinesBlock'

export type TConsole = {}

export const Console = pureComponent(
  startWithType<TConsole>(),
  mapConsoleStoreState(({ lines }) => ({
    lines,
  }), ['lines'])
)(({ lines }) => {
  if (lines.length === 0) {
    return (
      <Layout direction="vertical">
        <Layout_Item hAlign="center" vAlign="center">
          <Text>Console is empty</Text>
        </Layout_Item>
      </Layout>
    )
  }

  return (
    <Scroll shouldScrollHorizontally shouldScrollVertically shouldScrollToBottom>
      <LinesBlock lines={lines}/>
    </Scroll>
  )
})

Console.displayName = 'Console'
Console.componentSymbol = SYMBOL_CONSOLE
