import { ParentBlock } from '@revert/block'
import { Layout, Layout_Item, LAYOUT_SIZE_FIT } from '@revert/layout'
import { Size } from '@revert/size'
import { TextThemeContext } from '@revert/text'
import { component, startWithType, mapState, mapDebouncedHandlerTimeout, mapHandlers, mapContext, mapWithProps } from 'refun'
import { COLOR_TRANSPARENT } from '../../colors'
import { mapContextOverride } from '../../map/map-context-override'
import { Background } from '../background'
import { ButtonIcon } from '../button-icon'
import { Field } from '../field'
import { IconSearchSmall, IconCloseSmall } from '../icons'
import { ThemeContext, FieldThemeContext, ButtonIconThemeContext } from '../theme-context'

const HEIGHT = 40
const INPUT_HEIGHT = 20
const RADIUS = HEIGHT / 2

export type TSearchField = {
  onChange: (value: string) => void,
}

export const SearchField = component(
  startWithType<TSearchField>(),
  mapContext(ThemeContext),
  mapState('value', 'setValue', () => '', []),
  mapContextOverride('FieldThemeProvider', FieldThemeContext, ({ theme }) => ({
    height: INPUT_HEIGHT,
    leftPadding: 30,
    rightPadding: 10,
    color: theme.searchFieldColor,
    placeholderColor: theme.searchFieldPlaceholderColor,
  })),
  mapContextOverride('ButtonIconThemeProvider', ButtonIconThemeContext, ({ theme }) => ({
    backgroundColor: COLOR_TRANSPARENT,
    hoveredBackgroundColor: COLOR_TRANSPARENT,
    pressedBackgroundColor: COLOR_TRANSPARENT,
    iconColor: theme.searchFieldClearIconColor,
    hoveredIconColor: theme.searchFieldClearIconHoveredColor,
    pressedIconColor: theme.searchFieldClearIconPressedColor,
    borderColor: COLOR_TRANSPARENT,
    focusedBorderColor: theme.searchFieldClearIconFocusedBorderColor,
  })),
  mapContextOverride('IconThemeProvider', TextThemeContext, ({ theme, value }) => ({
    color: value.length > 0
      ? theme.searchFieldSearchIconActiveColor
      : theme.searchFieldSearchIconColor,
  })),
  mapWithProps(({ theme }) => ({
    backgroundColor: theme.searchFieldBackgroundColor,
  })),
  mapDebouncedHandlerTimeout('onChange', 200),
  mapHandlers({
    onChange: ({ setValue, onChange }) => (value: string) => {
      setValue(value)
      onChange(value)
    },
    onClear: ({ setValue, onChange }) => () => {
      setValue('')
      onChange('')
    },
  })
)(({
  backgroundColor,
  FieldThemeProvider,
  ButtonIconThemeProvider,
  IconThemeProvider,
  value,
  onChange,
  onClear,
}) => (
  <Layout hPadding={10}>
    <Background
      color={backgroundColor}
      radius={RADIUS}
    />
    <ParentBlock>
      <Layout hPadding={20}>
        <Layout_Item vAlign="center">
          <Size>
            <IconThemeProvider>
              <IconSearchSmall/>
            </IconThemeProvider>
          </Size>
        </Layout_Item>
      </Layout>
    </ParentBlock>
    <Layout_Item height={HEIGHT} vAlign="center">
      <FieldThemeProvider>
        <Field value={value} onChange={onChange} placeholder="Search"/>
      </FieldThemeProvider>
    </Layout_Item>
    <Layout_Item width={LAYOUT_SIZE_FIT} height={HEIGHT} vAlign="center">
      <ButtonIconThemeProvider>
        <ButtonIcon size={20} onPress={onClear}>
          <IconCloseSmall/>
        </ButtonIcon>
      </ButtonIconThemeProvider>
    </Layout_Item>
  </Layout>
))
