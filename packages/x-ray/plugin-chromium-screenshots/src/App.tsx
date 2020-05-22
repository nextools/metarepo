import React, { FC } from 'react'
import { App as XRayUiApp, SourceCode } from '@x-ray/ui'

export const App: FC = () => (
  <XRayUiApp
    renderMeta={(meta) => (
      <SourceCode source={meta}/>
    )}
  />
)
