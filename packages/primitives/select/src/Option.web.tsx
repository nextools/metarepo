import React from 'react'
import { component, startWithType } from 'refun'

export type TOption = {
  id?: string,
  isDisabled?: boolean,
  value: string,
  label: string,
}

export const Option = component(
  startWithType<TOption>()
)('Option', ({ id, value, label, isDisabled }) => (
  <option id={id} value={value} disabled={isDisabled}>{label}</option>
))
