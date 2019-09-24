import React, { FC } from 'react'
import { Icon } from '../icon'
import { TIcon } from './types'

export const IconReset: FC<TIcon> = ({ color }) => (
  <Icon
    color={color}
    d="M11.1,10.0 L15.8,5.3 C16.1,5.0 16.1,4.5 15.8,4.2 C15.5,3.9 15.0,3.9 14.7,4.2 L10.0,8.9 L5.3,4.2 C5.0,3.9 4.5,3.9 4.2,4.2 C3.9,4.5 3.9,5.0 4.2,5.3 L8.9,10.0 L4.2,14.7 C3.9,15.0 3.9,15.5 4.2,15.8 C4.4,15.9 4.6,16.0 4.7,16.0 C4.9,16.0 5.1,15.9 5.3,15.8 L10.0,11.1 L14.7,15.8 C14.9,15.9 15.1,16.0 15.2,16.0 C15.4,16.0 15.6,15.9 15.8,15.8 C16.1,15.5 16.1,15.0 15.8,14.7 L11.1,10.0 Z"
  />
)

IconReset.displayName = 'IconReset'
