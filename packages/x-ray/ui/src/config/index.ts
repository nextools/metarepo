import { rgba } from '@revert/color'

export const HOST = 'localhost'
export const PORT = 3001
export const DIFF_TIMEOUT = 1000
export const COL_WIDTH = 200
export const COL_SPACE = 10
export const SNAPSHOT_GRID_FONT_SIZE = 6
export const SNAPSHOT_GRID_LINE_HEIGHT = 8
export const SNAPSHOT_GRID_MAX_LINES = 50
export const DISCARD_ALPHA = 0.3
export const BORDER_SIZE = 2

export const COLOR_BLACK = rgba(0, 0, 0, 1)
export const COLOR_WHITE = rgba(255, 255, 255, 1)
export const COLOR_GRAY = rgba(200, 200, 200, 1)
export const COLOR_LIGHT_GRAY = rgba(240, 240, 240, 1)
export const COLOR_RED = rgba(255, 127, 127, 1)
export const COLOR_GREEN = rgba(127, 200, 127, 1)
export const COLOR_BLUE = rgba(127, 127, 200, 1)

export const COLOR_BORDER_NEW = COLOR_GREEN
export const COLOR_BORDER_DIFF = COLOR_BLUE
export const COLOR_BORDER_DELETED = COLOR_RED
export const COLOR_LINE_BG_ADDED = COLOR_GREEN
export const COLOR_LINE_BG_REMOVED = COLOR_RED
