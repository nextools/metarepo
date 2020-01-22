import React from 'react'
// @ts-ignore
// eslint-disable-next-line
import { App as TargetApp } from '__XRAY_PERF_APP_PATH__'
import { APP_DUPLICATE_COUNT } from './utils'

export const App = () => new Array(APP_DUPLICATE_COUNT).fill(<TargetApp/>)
