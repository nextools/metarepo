import React, { FC } from 'react'
import { Icon } from '../icon'
import { TIcon } from './types'

export const IconChevronUp: FC<TIcon> = ({ color }) => (
  <Icon
    color={color}
    d="M15.2,13.0 C15.1,13.0 14.9,12.9 14.7,12.8 L10.5,8.7 C10.2,8.4 9.8,8.4 9.5,8.7 L5.3,12.8 C5.0,13.1 4.5,13.1 4.2,12.8 C3.9,12.5 3.9,12.0 4.2,11.7 L8.4,7.6 C9.3,6.8 10.7,6.8 11.6,7.6 L15.8,11.7 C16.1,12.0 16.1,12.5 15.8,12.8 C15.6,12.9 15.4,13.0 15.2,13.0"
  />
)

IconChevronUp.displayName = 'IconChevronUp'
