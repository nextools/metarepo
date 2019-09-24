import React, { FC } from 'react'
import { Icon } from '../icon'
import { TIcon } from './types'

export const IconChevronDown: FC<TIcon> = ({ color }) => (
  <Icon
    color={color}
    d="M10.0,13.0 C9.4,13.0 8.9,12.8 8.4,12.4 L4.2,8.3 C3.9,8.0 3.9,7.5 4.2,7.2 C4.5,6.9 5.0,6.9 5.3,7.2 L9.5,11.3 C9.8,11.6 10.2,11.6 10.5,11.3 L14.7,7.2 C15.0,6.9 15.5,6.9 15.8,7.2 C16.1,7.5 16.1,8.0 15.8,8.3 L11.6,12.4 C11.1,12.8 10.6,13.0 10.0,13.0"
  />
)

IconChevronDown.displayName = 'IconChevronDown'
