import React, { FC } from 'react'
import { Icon } from '../icon'
import { TIcon } from './types'

export const IconChevronLeft: FC<TIcon> = ({ color }) => (
  <Icon
    color={color}
    d="M12.3,16.0 C12.1,16.0 11.9,15.9 11.7,15.8 L7.6,11.6 C6.8,10.7 6.8,9.3 7.6,8.4 L11.7,4.2 C12.0,3.9 12.5,3.9 12.8,4.2 C13.1,4.5 13.1,5.0 12.8,5.3 L8.7,9.5 C8.4,9.8 8.4,10.2 8.7,10.5 L12.8,14.7 C13.1,15.0 13.1,15.5 12.8,15.8 C12.6,15.9 12.4,16.0 12.3,16.0"
  />
)

IconChevronLeft.displayName = 'IconChevronLeft'
