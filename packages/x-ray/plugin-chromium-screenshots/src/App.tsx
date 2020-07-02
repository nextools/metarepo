import { App as XRayUiApp, SourceCode } from '@x-ray/ui'
import React, { FC } from 'react'

export const App: FC = () => (
  <XRayUiApp
    renderMeta={(meta) => (
      <SourceCode source={meta}/>
    )}
  />
)
