import { MarkdownThemeContext } from '@revert/markdown'
import { component, startWithType, mapContext } from 'refun'
import { mapContextOverride } from '../../map/map-context-override'
import { CheckmarkThemeContext } from './CheckmarkThemeContext'
import { DropdownThemeContext } from './DropdownThemeContext'
import { PopoverThemeContext } from './PopoverThemeContext'
import { SwitchThemeContext } from './SwitchThemeContext'
import { ThemeContext } from './ThemeContext'
import { TooltipThemeContext } from './TooltipThemeContext'

export type TRootThemeProvider = {}

export const RootThemeProvider = component(
  startWithType<TRootThemeProvider>(),
  mapContext(ThemeContext),
  mapContextOverride('SwitchThemeProvider', SwitchThemeContext, ({ theme }) => ({
    backgroundColor: theme.switchBackgroundColor,
    hoveredBackgroundColor: theme.switchBackgroundColor,
    pressedBackgroundColor: theme.switchBackgroundColor,
    activeBackgroundColor: theme.switchActiveBackgroundColor,
    activeHoveredBackgroundColor: theme.switchActiveBackgroundColor,
    activePressedBackgroundColor: theme.switchActiveBackgroundColor,
    iconColor: theme.switchKnobBackgroundColor,
    hoveredIconColor: theme.switchKnobBackgroundColor,
    pressedIconColor: theme.switchKnobBackgroundColor,
    activeIconColor: theme.switchKnobBackgroundColor,
    activeHoveredIconColor: theme.switchKnobBackgroundColor,
    activePressedIconColor: theme.switchKnobBackgroundColor,
    focusedOuterBorderColor: theme.switchFocusedBorderColor,
    activeFocusedOuterBorderColor: theme.switchActiveFocusedBorderColor,
  })),
  mapContextOverride('CheckmarkThemeProvider', CheckmarkThemeContext, ({ theme }) => ({
    backgroundColor: theme.checkmarkBackgroundColor,
    hoveredBackgroundColor: theme.checkmarkBackgroundColor,
    pressedBackgroundColor: theme.checkmarkBackgroundColor,
    activeBackgroundColor: theme.checkmarkActiveBackgroundColor,
    activeHoveredBackgroundColor: theme.checkmarkActiveBackgroundColor,
    activePressedBackgroundColor: theme.checkmarkActiveBackgroundColor,
    disabledBackgroundColor: theme.checkmarkDisabledBackgroundColor,
    activeDisabledBackgroundColor: theme.checkmarkActiveDisabledBackgroundColor,
    borderColor: theme.checkmarkBorderColor,
    hoveredBorderColor: theme.checkmarkBorderColor,
    pressedBorderColor: theme.checkmarkBorderColor,
    activeBorderColor: theme.checkmarkActiveBorderColor,
    activeHoveredBorderColor: theme.checkmarkActiveBorderColor,
    activePressedBorderColor: theme.checkmarkActiveBorderColor,
    disabledBorderColor: theme.checkmarkDisabledBorderColor,
    activeDisabledBorderColor: theme.checkmarkActiveDisabledBorderColor,
    iconColor: theme.checkmarkIconColor,
    hoveredIconColor: theme.checkmarkIconColor,
    pressedIconColor: theme.checkmarkIconColor,
    activeIconColor: theme.checkmarkIconColor,
    activeHoveredIconColor: theme.checkmarkIconColor,
    activePressedIconColor: theme.checkmarkIconColor,
    focusedOuterBorderColor: theme.checkmarkBorderColor,
    activeFocusedOuterBorderColor: theme.checkmarkActiveBorderColor,
  })),
  mapContextOverride('TooltipThemeProvider', TooltipThemeContext, ({ theme }) => ({
    backgroundColor: theme.tooltipBackgroundColor,
    color: theme.tooltipColor,
  })),
  mapContextOverride('PopoverThemeProvider', PopoverThemeContext, ({ theme }) => ({
    backgroundColor: theme.popoverBackgroundColor,
  })),
  mapContextOverride('DropdownThemeProvider', DropdownThemeContext, ({ theme }) => ({
    color: theme.dropdownColor,
    hoveredColor: theme.dropdownColor,
    focusedBorderColor: theme.dropdownFocusedBorderColor,
  })),
  mapContextOverride('MarkdownThemeProvider', MarkdownThemeContext, ({ theme }) => ({
    blockquoteBorderColor: theme.mdBlockquoteBorderColor,
    tableBorderColor: theme.mdTableBorderColor,
    codeColor: theme.mdCodeColor,
    codeBackgroundColor: theme.mdCodeBackgroundColor,
    codespanColor: theme.mdCodespanColor,
    hrBorderColor: theme.mdHrColor,
  }))
)(({
  CheckmarkThemeProvider,
  SwitchThemeProvider,
  TooltipThemeProvider,
  PopoverThemeProvider,
  DropdownThemeProvider,
  MarkdownThemeProvider,
  children,
}) => (
  <TooltipThemeProvider>
    <PopoverThemeProvider>
      <CheckmarkThemeProvider>
        <SwitchThemeProvider>
          <DropdownThemeProvider>
            <MarkdownThemeProvider>
              {children}
            </MarkdownThemeProvider>
          </DropdownThemeProvider>
        </SwitchThemeProvider>
      </CheckmarkThemeProvider>
    </PopoverThemeProvider>
  </TooltipThemeProvider>
))

RootThemeProvider.displayName = 'RootThemeProvider'
