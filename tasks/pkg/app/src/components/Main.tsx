import { Background } from '@revert/background'
import { Button } from '@revert/button'
import { Layout, Layout_Item } from '@revert/layout'
import { Text } from '@revert/text'
import { component, mapHandlers, startWithType } from 'refun'
import { setFooAction } from '../actions'
import { mapStoreDispatch, mapStoreState } from '../store'

export type TMain = {}

export const Main = component(
  startWithType<TMain>(),
  mapStoreState(({ foo }) => ({
    value: foo,
  }), ['foo']),
  mapStoreDispatch('dispatch'),
  mapHandlers({
    onPress: ({ dispatch }) => () => dispatch(setFooAction('bar')),
  })
)(({ value, onPress }) => (
  <Layout>
    <Layout_Item hAlign="center" vAlign="center">
      <Text shouldPreventWrap shouldHideOverflow>{value}</Text>
    </Layout_Item>
    <Layout_Item vAlign="center">
      <Layout>
        <Layout_Item hAlign="center" vAlign="center" height={50}>
          <Background color={0x000000ff}/>
          <Button onPress={onPress}>
            <Text color={0xffffffff}>set</Text>
          </Button>
        </Layout_Item>
      </Layout>
    </Layout_Item>
  </Layout>
))
