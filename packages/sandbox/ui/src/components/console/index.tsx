import React from 'react'
import { startWithType, pureComponent } from 'refun'
import { SYMBOL_CONSOLE } from '../../symbols'
import { Scroll } from '../scroll'
import { mapConsoleStoreState } from '../../store-console'
import { LinesBlock } from './LinesBlock'

export type TConsole = {}

export const Console = pureComponent(
  startWithType<TConsole>(),
  mapConsoleStoreState(({ lines }) => ({
    lines,
  }), ['lines'])
)(({ lines }) => (
  <Scroll shouldScrollHorizontally shouldScrollVertically shouldScrollToBottom>
    <LinesBlock lines={lines}/>
  </Scroll>
))

Console.displayName = 'Console'
Console.componentSymbol = SYMBOL_CONSOLE
