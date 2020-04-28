import React, { FC } from 'react'
import { App as XRayUiApp } from '@x-ray/ui'
import { SourceCode } from '@x-ray/ui/src/components/SourceCode'

export const App: FC = () => (
  <XRayUiApp
    renderMeta={(meta) => (
      <SourceCode source={meta}/>
    )}
  />
)
