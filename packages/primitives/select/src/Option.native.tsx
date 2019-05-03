import React, { FC } from 'react'
import { Picker } from 'react-native'
import { TOption } from './types'

export const Option: FC<TOption> = ({ id, value, label }) => (
  <Picker.Item testID={id} value={value} label={label}/>
)

Option.displayName = 'Option'
