import React, { FC } from 'react'
import { Icon } from '../icon'
import { TIcon } from './types'

export const IconChevronRight: FC<TIcon> = ({ color }) => (
  <Icon
    color={color}
    d="M7.7,16.0 C7.6,16.0 7.4,15.9 7.2,15.8 C6.9,15.5 6.9,15.0 7.2,14.7 L11.3,10.5 C11.6,10.2 11.6,9.8 11.3,9.5 L7.2,5.3 C6.9,5.0 6.9,4.5 7.2,4.2 C7.5,3.9 8.0,3.9 8.3,4.2 L12.4,8.4 C13.2,9.3 13.2,10.7 12.4,11.6 L8.3,15.8 C8.1,15.9 7.9,16.0 7.7,16.0"
  />
)

IconChevronRight.displayName = 'IconChevronRight'
