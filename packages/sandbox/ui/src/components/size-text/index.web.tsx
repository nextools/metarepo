import React from 'react'
import { component, startWithType } from 'refun'
import { Text, TText } from '../text'
import { SYMBOL_SIZE_TEXT } from '../../symbols'
import { SizeContent } from '../size-content'

export const SizeText = component(
  startWithType<TText>()
)((props) => (
  <SizeContent shouldPreventWrap={props.shouldPreventWrap}>
    <Text {...props}/>
  </SizeContent>
))

SizeText.displayName = 'SizeText'
SizeText.componentSymbol = SYMBOL_SIZE_TEXT
