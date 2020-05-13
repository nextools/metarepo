import { TColor } from 'colorido'

export const HOST = 'localhost'
export const PORT = 3001
export const DIFF_TIMEOUT = 1000
export const COL_WIDTH = 200
export const COL_SPACE = 20
export const SNAPSHOT_GRID_FONT_SIZE = 6
export const SNAPSHOT_GRID_LINE_HEIGHT = 8
export const SNAPSHOT_GRID_MAX_LINES = 50
export const DISCARD_ALPHA = 0.3
export const BORDER_SIZE = 3
export const BORDER_SIZE_SMAL = 2
export const DASH_SPACE = 35

export const COLOR_BLACK: TColor = [0, 0, 0, 1]
export const COLOR_WHITE: TColor = [255, 255, 255, 1]
export const COLOR_LIGHT_GREY: TColor = [249, 249, 251, 1]
export const COLOR_GREY: TColor = [230, 230, 230, 1]
export const COLOR_DARK_GREY: TColor = [90, 91, 100, 1]
export const COLOR_RED: TColor = [249, 65, 49, 1]
export const COLOR_LIGHT_RED: TColor = [255, 242, 241, 1]
export const COLOR_GREEN: TColor = [111, 207, 151, 1]
export const COLOR_LIGHT_GREEN: TColor = [236, 255, 244, 1]
export const COLOR_BLUE: TColor = [70, 147, 249, 1]
export const COLOR_ORANGE: TColor = [254, 126, 34, 1]
export const COLOR_LINE_BG_ADDED: TColor = [196, 255, 198, 1]
export const COLOR_LINE_BG_REMOVED: TColor = [255, 195, 190, 1]

export const COLOR_BORDER_NEW: TColor = COLOR_GREEN
export const COLOR_BORDER_DIFF: TColor = COLOR_BLUE
export const COLOR_BORDER_DELETED: TColor = COLOR_RED
