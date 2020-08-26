import { Scroll } from '@revert/scroll'
import React from 'react'
import { startWithType, pureComponent } from 'refun'
import { mapConsoleStoreState } from '../../store-console'
import { SYMBOL_CONSOLE } from '../../symbols'
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
