import React, { FC } from 'react'
import { View as NativeView, ViewProps } from 'react-native'

export const View: FC<ViewProps> = (props) => (
  <NativeView {...props}/>
)

View.displayName = 'View'
