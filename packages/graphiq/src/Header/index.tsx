import { Layout, Layout_Item } from '@revert/layout'
import { startWithType, pureComponent } from 'refun'
import { MonthButton } from './MonthButton'

const MONTHS = [1, 3, 6]

export type THeaderControls = {
  selectedMonths: number,
  onSelectMonths: (key: number) => void,
}

export const Header = pureComponent(
  startWithType<THeaderControls>()
)(({
  selectedMonths,
  onSelectMonths,
}) => (
  <Layout vPadding={20}>
    <Layout_Item hAlign="center">
      <Layout spaceBetween={10}>
        {MONTHS.map((num, i) => (
          <Layout_Item key={i}>
            <MonthButton
              selectedMonthsAgo={selectedMonths}
              months={num}
              onSelectMonths={onSelectMonths}
            >
              {num} month
            </MonthButton>
          </Layout_Item>
        ))}
      </Layout>
    </Layout_Item>
  </Layout>
))

Header.displayName = 'Header'
Header.componentSymbol = Symbol('HEADER')
