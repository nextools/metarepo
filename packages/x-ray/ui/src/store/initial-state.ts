import { TState } from '../types'

export const initialState: TState = {
  isSaved: false,
  isLoading: false,
  type: null,
  selectedItem: null,
  files: [],
  items: {},
  discardedItems: [],
  filteredFiles: [],
}
