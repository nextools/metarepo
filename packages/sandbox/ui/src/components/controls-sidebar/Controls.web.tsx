import React from 'react'
import { pureComponent, startWithType } from 'refun'
import { isUndefined } from 'tsfn'
import { ComponentControls } from '../component-controls'
import { mapMetaStoreState } from '../../store-meta'

export const Controls = pureComponent(
  startWithType<{}>(),
  mapMetaStoreState(({ Component, componentConfig, componentPropsChildrenMap }) => ({
    Component,
    componentConfig,
    componentPropsChildrenMap,
  }), ['Component', 'componentConfig', 'componentPropsChildrenMap'])
)(({
  Component,
  componentConfig,
  componentPropsChildrenMap,
}) => {
  if (isUndefined(Component) || isUndefined(componentConfig) || isUndefined(componentPropsChildrenMap)) {
    return null
  }

  return (
    <ComponentControls
      Component={Component}
      componentConfig={componentConfig}
      componentPropsChildrenMap={componentPropsChildrenMap}
    />
  )
})
