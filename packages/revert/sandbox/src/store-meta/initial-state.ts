import { EMPTY_OBJECT } from 'tsfn'
import type { TMetaState } from './types'

export const initialState: TMetaState = {
  components: null,
  componentKey: null,
  propsIndex: '0',
  selectedElementPath: '',
  componentConfig: null,
  componentControls: null,
  Component: null,
  componentProps: EMPTY_OBJECT,
  componentPropsChildrenMap: EMPTY_OBJECT,
  packageJson: null,
  readme: null,
}
