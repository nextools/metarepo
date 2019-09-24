import React from 'react'
import { startWithType, mapHandlers, pureComponent, mapState } from 'refun'
import { TColor } from 'colorido'
import { TPosition } from '../../types'
import { buttonIconSwitchSize, ButtonIconSwitch } from '../button-icon-switch'
import { IconMinus, IconPlus } from '../icons'

export type TComponentSwitchProps = {
  propPath: string[],
  isChecked: boolean,
  color: TColor,
  onChange: (propPath: string[], propValue: any) => void,
} & TPosition

export const componentSwitchSize = buttonIconSwitchSize

export const ComponentSwitch = pureComponent(
  startWithType<TComponentSwitchProps>(),
  mapState('value', 'setValue', ({ isChecked }) => isChecked, ['isChecked']),
  mapHandlers({
    onToggle: ({ setValue, onChange, propPath, isChecked }) => () => {
      setValue(!isChecked)
      onChange(
        propPath,
        isChecked ? undefined : {}
      )
    },
  })
)(({ value, left, top, color, onToggle }) => (
  <ButtonIconSwitch
    left={left}
    top={top}
    isChecked={value}
    onToggle={onToggle}
  >
    {value ? <IconMinus color={color}/> : <IconPlus color={color}/>}
  </ButtonIconSwitch>
))

ComponentSwitch.displayName = 'ComponentSwitch'
