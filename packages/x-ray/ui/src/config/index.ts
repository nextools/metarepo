import { TColor } from 'colorido'

export const HOST = 'localhost'
export const PORT = 3001
export const DIFF_TIMEOUT = 1000
export const COL_WIDTH = 200
export const COL_SPACE = 10
export const SNAPSHOT_GRID_FONT_SIZE = 6
export const SNAPSHOT_GRID_LINE_HEIGHT = 8
export const SNAPSHOT_GRID_MAX_LINES = 50
export const DISCARD_ALPHA = 0.3
export const BORDER_SIZE = 3

export const COLOR_BLACK: TColor = [0, 0, 0, 1]
export const COLOR_WHITE: TColor = [255, 255, 255, 1]
export const COLOR_GRAY: TColor = [200, 200, 200, 1]
export const COLOR_LIGHT_BLUE: TColor = [246, 247, 252, 1]
export const COLOR_RED: TColor = [255, 127, 127, 1]
export const COLOR_GREEN: TColor = [127, 200, 127, 1]
export const COLOR_GREY: TColor = [247, 248, 250, 1]
export const COLOR_BLUE: TColor = [70, 147, 249, 1]
export const COLOR_DARK_GRAY: TColor = [90, 91, 100, 1]

export const COLOR_BORDER_NEW: TColor = COLOR_GREEN
export const COLOR_BORDER_DIFF: TColor = COLOR_BLUE
export const COLOR_BORDER_DELETED: TColor = COLOR_RED
export const COLOR_LINE_BG_ADDED: TColor = COLOR_GREEN
export const COLOR_LINE_BG_REMOVED: TColor = COLOR_RED
