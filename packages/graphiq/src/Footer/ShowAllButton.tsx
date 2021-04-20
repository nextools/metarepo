import { Background } from '@revert/background'
import { Button } from '@revert/button'
import { Layout, Layout_Item } from '@revert/layout'
import { Text } from '@revert/text'
import { pureComponent, startWithType } from 'refun'
import { COLOR_WHITE } from '../constants'

export type TShowAllButton = {
  onShowAllGraphs: () => void,
}

export const ShowAllButton = pureComponent(
  startWithType<TShowAllButton>()
)(({ onShowAllGraphs }) => (
  <Layout>
    <Layout_Item hPadding={20} vAlign="center">
      <Button onPress={onShowAllGraphs}>
        <Background color={COLOR_WHITE}/>
        <Text fontSize={14}>
          Show all
        </Text>
      </Button>
    </Layout_Item>
  </Layout>
))

ShowAllButton.displayName = 'ShowAllButton'
