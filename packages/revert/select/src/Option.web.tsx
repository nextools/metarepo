import React, { FC } from 'react'
import { TOption } from './types'

export const Option: FC<TOption> = ({ id, value, label, isDisabled }) => (
  <option id={id} value={value} disabled={isDisabled}>{label}</option>
)

Option.displayName = 'Option'
