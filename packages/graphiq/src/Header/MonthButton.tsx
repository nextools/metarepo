import { Border } from '@revert/border'
import { Button } from '@revert/button'
import { Layout, Layout_Item, Layout_Spacer } from '@revert/layout'
import { Text } from '@revert/text'
import type { TTextChildren } from '@revert/text'
import { startWithType, mapHandlers, mapWithProps, component } from 'refun'
import { COLOR_WHITE } from '../constants'

const COLOR_BORDER_SELECTED = 0xffeb3bff
const COLOR_BORDER = 0xccccccff

export type TMonthButton = {
  selectedMonthsAgo: number,
  months: number,
  children: TTextChildren,
  onSelectMonths: (monthAgo: number) => void,
}

export const MonthButton = component(
  startWithType<TMonthButton>(),
  mapHandlers({
    onPress: ({ months, onSelectMonths }) => () => {
      onSelectMonths(months)
    },
  }),
  mapWithProps(({ months, selectedMonthsAgo }) => ({
    borderColor: months === selectedMonthsAgo ? COLOR_BORDER_SELECTED : COLOR_BORDER,
  }))
)(({ borderColor, children, onPress }) => (
  <Layout direction="vertical">
    <Border borderBottomWidth={2} color={borderColor}/>
    <Layout_Item hPadding={14} vAlign="center">
      <Button onPress={onPress}>
        <Text color={COLOR_WHITE} fontSize={14}>
          {children}
        </Text>
      </Button>
    </Layout_Item>
    <Layout_Spacer height={2}/>
  </Layout>
))
