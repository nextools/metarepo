import type { TState } from '../types'

export const initialState: TState = {
  activeTab: null,
  discardedItems: [],
  files: [],
  filteredFiles: [],
  isLoading: false,
  isSaved: false,
  items: {},
  selectedItem: null,
  type: null,
}
