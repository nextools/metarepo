import React, { FC } from 'react'
import { Icon } from '../icon'
import { TIcon } from './types'

export const IconPlus: FC<TIcon> = ({ color }) => (
  <Icon
    color={color}
    d="M10.8,9.3 L10.8,4.8 C10.8,4.3 10.4,4.0 10.0,4.0 C9.6,4.0 9.3,4.3 9.3,4.8 L9.3,9.3 L4.8,9.3 C4.3,9.3 4.0,9.6 4.0,10.0 C4.0,10.4 4.3,10.8 4.8,10.8 L9.3,10.8 L9.3,15.3 C9.3,15.7 9.6,16.0 10.0,16.0 C10.4,16.0 10.8,15.7 10.8,15.3 L10.8,10.8 L15.3,10.8 C15.7,10.8 16.0,10.4 16.0,10.0 C16.0,9.6 15.7,9.3 15.3,9.3 L10.8,9.3 Z"
  />
)

IconPlus.displayName = 'IconPlus'
